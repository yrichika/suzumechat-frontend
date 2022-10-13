import { Client, IFrame, IMessage } from '@stomp/stompjs'
import { htmlspecialchars } from '@utils/Util'
import { useEffect, useState } from 'react'
import ChatMessage from 'types/ChatMessage'
import CryptoJS from 'crypto-js'
import { connect, isInactive } from './stomp/config'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import useVisitorsRequestsStore from '@stores/useVisitorsRequestsStore'
import VisitorsAuthStatus from 'types/messages/VisitorsAuthStatus'
import useChatMessagesStore from '@stores/useChatMessagesStore'
import {
  isChatMessageCapsuleMessage,
  isError,
  isVisitorsRequestMessage,
} from '@utils/WebSocketMessageHelper'
import VisitorsRequest from 'types/messages/VisitorsRequest'
import Terminate from 'types/messages/Terminate'

export default function useHostMessageHandler(
  hostChannelToken: string,
  codename: string,
  secretKey: string,
  color: string
) {
  // common
  const [stompClient, setStompClient] = useState<Client>()
  const WS_ENDPOINT_URL = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/${process.env.NEXT_PUBLIC_WS_ENDPOINT}`
  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/host/${hostChannelToken}`
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/host/${hostChannelToken}`

  // Chat
  const chatMessages = useChatMessagesStore(store => store.messages)
  const addChatMessage = useChatMessagesStore(store => store.addMessage)
  const clearChatMessages = useChatMessagesStore(store => store.clear)
  const chatMessageIndex = useChatMessagesStore(store => store.index)
  const incrementMessageIndex = useChatMessagesStore(
    store => store.incrementIndex
  )
  const CHANNEL_ENDED_MESSAGE = '__channel_ended__'

  // visitors request handler
  const visitorsRequests = useVisitorsRequestsStore(state => state.requests)
  const addRequest = useVisitorsRequestsStore(state => state.add)
  const updateRequest = useVisitorsRequestsStore(state => state.update)
  const clearRequests = useVisitorsRequestsStore(state => state.clear)

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      console.log('chat ws connected!')
      stompClient.subscribe(WS_RECEIVE_URL, receive)
    }
  }

  function receive(message: IMessage) {
    console.log('received message: ' + message.body)
    const messageBody = JSON.parse(message.body)
    if (isChatMessageCapsuleMessage(messageBody)) {
      handleChatMessage(messageBody)
    } else if (isVisitorsRequestMessage(messageBody)) {
      handleVisitorsRequest(messageBody)
    } else if (isError(messageBody)) {
      // TODO: error handling
      // TODO: エラーメッセージごとに処理を変える?
    } else {
      console.log("can't handle this message!")
    }
  }

  function handleChatMessage(messageBody: any) {
    const chatMessage: ChatMessage = decrypt(messageBody)
    addChatMessage(chatMessage)
  }

  function handleVisitorsRequest(messageBody: any) {
    addRequest(messageBody)
  }

  function sendApproval(request: VisitorsRequest, isAuthenticated: boolean) {
    if (isInactive(stompClient)) {
      return
    }
    const auth: VisitorsAuthStatus = {
      visitorId: request.visitorId,
      isAuthenticated: isAuthenticated,
    }
    stompClient!.publish({
      destination: WS_SEND_URL,
      body: JSON.stringify(auth),
    })

    request.isAuthenticated = isAuthenticated
    updateRequest(request)
  }

  function sendChatMessage(messageInput: string) {
    if (isInactive(stompClient)) {
      return
    }

    console.log('sending message: [' + messageInput + ']')
    const encryptedMessage = encrypt(messageInput)
    const messageCapsule: ChatMessageCapsule = { encryptedMessage }
    stompClient?.publish({
      destination: WS_SEND_URL,
      body: JSON.stringify(messageCapsule),
    })
  }

  function sendTerminateMessage() {
    // TODO: handle this message on guest side
    const terminateMessage: Terminate = {
      terminatedBy: 'host',
      message: CHANNEL_ENDED_MESSAGE,
      data: null,
    }
    stompClient?.publish({
      destination: WS_SEND_URL,
      body: JSON.stringify(terminateMessage),
    })
  }

  function disconnect() {
    if (!stompClient) {
      return
    }
    if (!stompClient.active) {
      return
    }
    sendTerminateMessage()
    clearChatMessages()
    clearRequests()
    stompClient.deactivate()
    console.log('WebSocket disconnected')
  }

  function encrypt(
    sendingMessage: string,
    timestamp: number = Date.now()
  ): string {
    const sanitizedMessage = htmlspecialchars(sendingMessage)
    const chatMessage: ChatMessage = {
      id: chatMessageIndex,
      name: codename,
      message: sanitizedMessage,
      color: color,
      timestamp: timestamp,
    }
    incrementMessageIndex()
    const jsonedMessage = JSON.stringify(chatMessage)
    return CryptoJS.AES.encrypt(jsonedMessage, secretKey).toString()
  }

  function decrypt(messageCapsule: ChatMessageCapsule): ChatMessage {
    const bytes = CryptoJS.AES.decrypt(
      messageCapsule.encryptedMessage,
      secretKey
    )
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  }

  useEffect(() => {
    connect(setStompClient, onConnect, WS_ENDPOINT_URL)
  }, [])

  return {
    chatMessages,
    visitorsRequests,
    sendChatMessage,
    sendApproval,
    disconnect,
  }
}
