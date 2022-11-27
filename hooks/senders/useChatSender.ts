import { isInactive } from '@hooks/stomp/config'
import { encrypt } from '@hooks/utils/ChatMessageCrypter'
import { Client } from '@stomp/stompjs'
import { sanitizeText } from '@utils/Util'
import ChatMessage from 'types/ChatMessage'
import ChatUserAppearance from 'types/ChatUserAppearance'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'

// REFACTOR: too many parameters, and not sure if order of parameter is right
export default function useChatSender(
  stompClient: Client,
  wsSendUrl: string,
  chatMessageIndex: number,
  userAppearance: ChatUserAppearance,
  secretKey: string
) {
  function sendChatMessage(messageInput: string) {
    if (isInactive(stompClient)) {
      return
    }
    console.log('sending message: [' + messageInput + ']')
    const timestamp = Date.now()
    const sanitizedMessage = sanitizeText(messageInput)
    const chatMessage: ChatMessage = {
      id: chatMessageIndex,
      name: userAppearance.codename,
      message: sanitizedMessage,
      color: userAppearance.color,
      timestamp: timestamp,
    }
    const encryptedMessage = encrypt(chatMessage, secretKey)
    const messageCapsule: ChatMessageCapsule = { encryptedMessage }
    stompClient?.publish({
      destination: wsSendUrl,
      body: JSON.stringify(messageCapsule),
    })
  }

  return {
    sendChatMessage,
  }
}
