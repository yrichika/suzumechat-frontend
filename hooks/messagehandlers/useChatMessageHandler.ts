import { Client } from '@stomp/stompjs'
import { StoreApi, UseBoundStore } from 'zustand'
import useChatReceiver from '@hooks/receivers/useChatReceiver'
import useChatSender from '@hooks/senders/useChatSender'
import ChatUserAppearance from 'types/ChatUserAppearance'
import ChatMessage from 'types/ChatMessage'

export function useChatMessageHandler(
  stompClient: Client | undefined,
  wsSendUrl: string,
  userAppearance: ChatUserAppearance,
  secretKey: string,
  addChatMessage: (newChat: ChatMessage) => void,
  chatMessageIndex: number,
  incrementMessageIndex: () => any
) {
  const { receiveChatMessage } = useChatReceiver(addChatMessage, secretKey)
  const { sendChatMessage } = useChatSender(
    stompClient,
    wsSendUrl,
    chatMessageIndex,
    incrementMessageIndex,
    userAppearance,
    secretKey
  )

  return {
    sendChatMessage,
    receiveChatMessage,
  }
}
