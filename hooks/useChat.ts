import { Client, IFrame } from '@stomp/stompjs'
import { htmlspecialchars } from '@utils/Util'
import { useEffect, useState } from 'react'
import ChatMessage from 'types/ChatMessage'
import CryptoJS from 'crypto-js'
import { stompBasicConfig } from './stomp/config'

export default function useChat(
  webSocketUrl: string,
  codename: string,
  secretKey: string,
  color: string
) {
  const [stompClient, setStompClient] = useState<Client>()
  const [messages, setMessages] = useState<Array<ChatMessage>>([])
  const [messageIndex, setMessageIndex] = useState(1)
  const CHANNEL_ENDED_MESSAGE = '__channel_ended__'

  function connect() {
    const stompClient = new Client()
    stompClient.configure({
      ...stompBasicConfig,
      onConnect: onConnect(stompClient),
    })
    stompClient.activate()
    setStompClient(stompClient)
  }

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      stompClient.subscribe(
        `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}${webSocketUrl}`,
        messageOutput => {
          console.log('received message: ' + messageOutput.body)

          const rawMessageEnc = messageOutput.body.toString()
          // TODO: save: sessonStorageにデータを保存すること
          const chatMessage: ChatMessage = decrypt(rawMessageEnc)
          if (chatMessage.message === CHANNEL_ENDED_MESSAGE) {
            console.log('channel should be closed')
            // TODO: ここで、__channel_ended__のメッセージを受け取ったら、クライアント側のチャットを終了
            // stompClient.deactivate()
            // TODO: show chat ended component or redirect to such page
            // WARNING! リロードしても、チャットができるページが表示されないようにすること
            return // early returnしてメッセージがチャットに表示されないようにする
          }
          setMessages(prevState => [...prevState, chatMessage])
        }
      )
    }
  }

  function sendMessage(messageInput: string) {
    if (!stompClient) {
      console.warn('No STOMP client. Not being able to send message.')
      return
    }
    // users can't send channelEndedMessage
    if (messageInput === CHANNEL_ENDED_MESSAGE) {
      return
    }
    console.log('sending message: [' + messageInput + ']')
    const encryptedMessage = encrypt(messageInput)
    stompClient?.publish({
      destination: `${process.env.NEXT_PUBLIC_WS_CHAT_SEND_PREFIX}${webSocketUrl}`,
      body: encryptedMessage,
    })
  }

  /**
   * This function should NEVER be used by users
   */
  function sendChannelEndedMessage() {
    const encryptedMessage = encrypt(CHANNEL_ENDED_MESSAGE)
    stompClient?.publish({
      destination: `${process.env.NEXT_PUBLIC_WS_CHAT_SEND_PREFIX}${webSocketUrl}`,
      body: encryptedMessage,
    })
  }

  function disconnect() {
    if (!stompClient) {
      return
    }
    if (!stompClient.active) {
      return
    }
    sendChannelEndedMessage()
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
