import endChatService from '@services/endChatService'
import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isChatMessageCapsule,
  isErrorMessage,
  isTerminate,
} from '@utils/WebSocketMessageHelper'
import { useRouter } from 'next/router'
import Terminate from 'types/messages/Terminate'

export default function useGuestReceiver(
  guestChannelToken: string,
  stompClient: Client,
  receiveChatMessage: (messageBody: any) => void,
  clearGuestStore: () => void,
  disconnect: () => Promise<void>
) {
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/guest/${guestChannelToken}`

  const router = useRouter()

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      console.log('guest chat ws connected')
      stompClient.subscribe(WS_RECEIVE_URL, receive)
    }
  }

  function receive(message: IMessage) {
    const messageBody = JSON.parse(message.body)
    if (isChatMessageCapsule(messageBody)) {
      receiveChatMessage(messageBody)
    } else if (isTerminate(messageBody)) {
      handleTerminate(messageBody)
    } else if (isErrorMessage(messageBody)) {
      // TODO: display error notification on screen
    } else {
      // TODO: display error notification on screen
    }
  }

  function handleTerminate(terminate: Terminate) {
    disconnect()
    endChatService(guestChannelToken!)
      .then(response => {
        clearGuestStore()
        router.push('/guest/ended')
      })
      .catch(error => {
        clearGuestStore()
        router.push('/guest/ended')
      })
  }

  return {
    onConnect,
  }
}
