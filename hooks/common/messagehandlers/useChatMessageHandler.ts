import useChatReceiver from '@hooks/common/messagehandlers/receivers/useChatReceiver'
import useChatSender from '@hooks/common/messagehandlers/senders/useChatSender'
import { Client } from '@stomp/stompjs'
import ChatMessage from 'types/ChatMessage'
import ChatUserAppearance from 'types/ChatUserAppearance'

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
