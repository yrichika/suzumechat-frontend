import { Client } from '@stomp/stompjs'
import { StoreApi, UseBoundStore } from 'zustand'
import useChatReceiver from '@hooks/receivers/useChatReceiver'
import useChatSender from '@hooks/senders/useChatSender'
import ChatUserAppearance from 'types/ChatUserAppearance'
import ChatMessage from 'types/ChatMessage'

export function useChatMessageHandler(
  stompClient: Client,
  wsSendUrl: string,
  userAppearance: ChatUserAppearance,
  secretKey: string,
  addChatMessage: (newChat: ChatMessage) => void,
  chatMessageIndex: number
) {
  const { receiveChatMessage } = useChatReceiver(addChatMessage, secretKey)
  const { sendChatMessage } = useChatSender(
    stompClient,
    wsSendUrl,
    chatMessageIndex,
    userAppearance,
    secretKey
  )

  return {
    sendChatMessage,
    receiveChatMessage,
  }
}
