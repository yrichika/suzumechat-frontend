import { decrypt } from '@hooks/utils/ChatMessageCrypter'
import ChatMessage from 'types/ChatMessage'

export default function useChatReceiver(
  addChatMessage: (chatMessage: ChatMessage) => void,
  secretKey: string
) {
  function receiveChatMessage(messageBody: any) {
    const chatMessage: ChatMessage = decrypt(messageBody, secretKey)
    addChatMessage(chatMessage)
  }

  return {
    receiveChatMessage,
  }
}
