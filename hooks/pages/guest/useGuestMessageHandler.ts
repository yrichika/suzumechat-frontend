import useGuestChatMessagesStore from '@stores/useGuestChatMessagesStore'
import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'
import { useEffect } from 'react'
import { useChatMessageHandler } from '../../messagehandlers/useChatMessageHandler'
import useGuestReceiver from '../../receivers/useGuestReceiver'
import { connect } from '../../stomp/config'

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

  function disconnect(): Promise<void> {
    if (stompClient.active) {
      return stompClient.deactivate()
    }
    return new Promise(() => {})
  }

  const { onConnect } = useGuestReceiver(
    guestChannelToken,
    receiveChatMessage,
    disconnect
  )

  useEffect(() => {
    connect(stompClient, onConnect)
  }, [])

  return {
    chatMessages,
    sendChatMessage,
    disconnect,
  }
}
