import { decrypt } from '@hooks/utils/ChatMessageCrypter'
import ChatMessage from 'types/ChatMessage'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'

export default function useChatReceiver(
  addChatMessage: (chatMessage: ChatMessage) => void,
  secretKey: string
) {
  function receiveChatMessage(messageBody: ChatMessageCapsule) {
    const encryptedMessage = messageBody.encryptedMessage
    const chatMessage: ChatMessage = decrypt(encryptedMessage, secretKey)
    addChatMessage(chatMessage)
  }

  return {
    receiveChatMessage,
  }
}
