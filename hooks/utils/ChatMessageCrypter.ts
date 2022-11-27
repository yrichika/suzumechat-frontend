import ChatMessage from 'types/ChatMessage'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import CryptoJS from 'crypto-js'

export function encrypt(chatMessage: ChatMessage, secretKey: string): string {
  const jsonedMessage = JSON.stringify(chatMessage)
  return CryptoJS.AES.encrypt(jsonedMessage, secretKey).toString()
}

export function decrypt(
  encryptedMessage: string,
  secretKey: string
): ChatMessage {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, secretKey)
  const decrypted = bytes.toString(CryptoJS.enc.Utf8)
  return JSON.parse(decrypted)
}
