import { Client, IFrame, IMessage } from '@stomp/stompjs'
import useGuestChatMessagesStore from '@stores/useGuestChatMessagesStore'
import {
  isChatMessageCapsuleMessage,
  isError,
  isTerminateMessage,
} from '@utils/WebSocketMessageHelper'
import { useEffect, useState } from 'react'
import Terminate from 'types/messages/Terminate'
import useGuestReceiver from './receivers/useGuestReceiver'
import { connect, isInactive } from './stomp/config'
import { useChatMessageHandler } from './messagehandlers/useChatMessageHandler'
import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'

export default function useGuestMessageHandler(
  guestChannelToken: string,
  codename: string,
  secretKey: string,
  color: string
) {
  const stompClient = useVisitorGuestSharedStompClientStore(
    store => store.stompClient
  )

  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/guest/${guestChannelToken}`

  const chatMessages = useGuestChatMessagesStore(store => store.messages)
  const addChatMessage = useGuestChatMessagesStore(store => store.addMessage)
  const clearChatMessages = useGuestChatMessagesStore(store => store.clear)
  const chatMessageIndex = useGuestChatMessagesStore(store => store.index)

  const userAppearance = { codename, color }
  const { sendChatMessage, receiveChatMessage } = useChatMessageHandler(
    stompClient,
    WS_SEND_URL,
    userAppearance,
    secretKey,
    addChatMessage,
    chatMessageIndex
  )

  const { onConnect } = useGuestReceiver(guestChannelToken, receiveChatMessage)

  function disconnect() {
    if (isInactive(stompClient)) {
      return new Promise(() => {})
    }
    clearChatMessages()
    console.log('WebSocket disconnected')
    return stompClient?.deactivate()
  }

  useEffect(() => {
    connect(stompClient, onConnect)
  }, [])

  return {
    chatMessages,
    sendChatMessage,
    disconnect,
  }
}
