import { Client, IFrame, IMessage } from '@stomp/stompjs'
import useGuestChatMessagesStore from '@stores/useGuestChatMessagesStore'
import {
  isChatMessageCapsuleMessage,
  isError,
  isTerminateMessage,
} from '@utils/WebSocketMessageHelper'
import { useEffect, useState } from 'react'
import Terminate from 'types/messages/Terminate'
import { connect } from './stomp/config'
import { useChatMessageHandler } from './stomp/useChatMessageHandler'

export default function useGuestMessageHandler(
  guestChannelToken: string,
  codename: string,
  secretKey: string,
  color: string
) {
  const [stompClient, setStompClient] = useState<Client>()
  const WS_ENDPOINT_URL = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/${process.env.NEXT_PUBLIC_WS_ENDPOINT}`
  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/guest/${guestChannelToken}`
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/guest/${guestChannelToken}`

  const {
    chatMessages,
    sendChatMessage,
    handleChatMessage,
    clearChatMessages,
  } = useChatMessageHandler(
    useGuestChatMessagesStore,
    stompClient,
    WS_SEND_URL,
    codename,
    secretKey,
    color
  )

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      console.log('guest chat ws connected')
      stompClient.subscribe(WS_RECEIVE_URL, receive)
    }
  }

  function receive(message: IMessage) {
    console.log('received message:' + message.body)
    const messageBody = JSON.parse(message.body)
    if (isChatMessageCapsuleMessage(messageBody)) {
      handleChatMessage(messageBody)
    } else if (isTerminateMessage(messageBody)) {
      handleTerminate(messageBody)
    } else if (isError(messageBody)) {
      // TODO: display error notification on screen
    } else {
      // TODO: display error notification on screen
    }
  }

  function handleTerminate(terminate: Terminate) {
    // TODO: end chat and redirect to chat ended page
    disconnect()
  }

  function disconnect() {
    if (!stompClient) {
      return
    }
    if (!stompClient.active) {
      return
    }
    clearChatMessages()
    stompClient.deactivate()
    console.log('WebSocket disconnected')
  }

  useEffect(() => {
    connect(setStompClient, onConnect, WS_ENDPOINT_URL)
  }, [])

  return {
    chatMessages,
    sendChatMessage,
    disconnect,
  }
}
