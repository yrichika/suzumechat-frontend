import { Client } from '@stomp/stompjs'
import { colors } from '@utils/colors'
import { htmlspecialchars } from '@utils/Util'
import { useEffect, useState } from 'react'
import SockJS from 'sockjs-client'
import ChatMessage from 'types/ChatMessage'
import CryptoJS from 'crypto-js'

export default function useChat(
  webSocketUrl: string,
  codename: string,
  secretKey: string,
  color: string
) {
  const [stompClient, setStompClient] = useState<Client>()
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [messageIndex, setMessageIndex] = useState(1)

  function connect() {
    const sockJsProtocols = ['xhr-streaming', 'xhr-polling']
    const stompClient = new Client()
    stompClient.configure({
      connectHeaders: {},
      // debug: message => console.log(message), // TODO: devのときのみ有効にするよう修正
      reconnectDelay: 5000, // millisec
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      logRawCommunication: false,
      webSocketFactory: () => {
        return new SockJS(
          `${process.env.NEXT_PUBLIC_BACK_PREFIX}/${process.env.NEXT_PUBLIC_WS_ENTRY_POINT}`,
          null,
          {
            transports: sockJsProtocols,
          }
        )
      },
      onConnect: frame => {
        console.log(
          `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}${webSocketUrl}`
        )
        stompClient.subscribe(
          `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}${webSocketUrl}`,
          messageOutput => {
            console.log('received message: ' + messageOutput.body)

            const rawMessageEnc = messageOutput.body.toString()
            // TODO: save: sessonStorageにデータを保存すること
            const chatMessage: ChatMessage = decrypt(rawMessageEnc)
            setMessages(prevState => [...prevState, chatMessage])
          }
        )
      },
      onStompError: frame => {
        // TODO:
        console.log('Stomp Error', frame)
      },
      onDisconnect: frame => {
        // TODO:
        console.log('Stomp Disconnected', frame)
      },
      onWebSocketClose: frame => {
        // TODO:
        console.log('Stomp WebSocket Closed', frame)
      },
      onWebSocketError: frame => {
        // TODO:
        console.log('Stomp WebSocket Error', frame)
      },
    })

    stompClient.activate()
    setStompClient(stompClient)
  }

  function sendMessage(messageInput: string) {
    if (!stompClient) {
      console.warn('No STOMP client. Not being able to send message.')
      return
    }
    console.log('sending message: [' + messageInput + ']')
    const encryptedMessage = encrypt(messageInput)
    stompClient?.publish({
      destination: `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}${webSocketUrl}`,
      body: encryptedMessage,
    })
  }

  // TODO: まだ使ってない。というか使わないかもしれない
  function disconnect() {
    if (!stompClient) {
      return
    }
    stompClient.deactivate()
    console.log('WebSocket disconnected')
  }

  function encrypt(
    sendingMessage: string,
    timestamp: number = Date.now()
  ): string {
    const sanitizedMessage = htmlspecialchars(sendingMessage)
    const chatMessage: ChatMessage = {
      id: messageIndex,
      name: codename,
      message: sanitizedMessage,
      color: color,
      timestamp: timestamp,
    }
    setMessageIndex(prev => prev + 1)
    const jsonedMessage = JSON.stringify(chatMessage)
    return CryptoJS.AES.encrypt(jsonedMessage, secretKey).toString()
  }

  function decrypt(encryptedMessage: string): ChatMessage {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  }

  useEffect(() => {
    connect()
  }, [])

  return { messages, sendMessage, disconnect }
}
