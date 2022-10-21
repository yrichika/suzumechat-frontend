import { isInactive } from '@hooks/stomp/config'
import { encrypt } from '@hooks/utils/ChatMessageCrypter'
import { Client } from '@stomp/stompjs'
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
    const encryptedMessage = encrypt(
      userAppearance.codename,
      messageInput,
      chatMessageIndex,
      userAppearance.color,
      secretKey
    )
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
