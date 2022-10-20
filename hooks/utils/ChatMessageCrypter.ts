import { htmlspecialchars } from '@utils/Util'
import ChatMessage from 'types/ChatMessage'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import CryptoJS from 'crypto-js'

export function encrypt(
  codename: string,
  sendingMessage: string,
  chatMessageIndex: number,
  color: string,
  secretKey: string
): string {
  const timestamp = Date.now()
  const sanitizedMessage = htmlspecialchars(sendingMessage)
  const chatMessage: ChatMessage = {
    id: chatMessageIndex,
    name: codename,
    message: sanitizedMessage,
    color: color,
    timestamp: timestamp,
  }
  const jsonedMessage = JSON.stringify(chatMessage)
  return CryptoJS.AES.encrypt(jsonedMessage, secretKey).toString()
}

export function decrypt(
  messageCapsule: ChatMessageCapsule,
  secretKey: string
): ChatMessage {
  const bytes = CryptoJS.AES.decrypt(messageCapsule.encryptedMessage, secretKey)
  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decrypted)
}
