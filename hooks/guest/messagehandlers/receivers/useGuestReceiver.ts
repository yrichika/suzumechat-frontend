import { handleWithMatchedHandler } from '@hooks/utils/Messaging'
import endChatService from '@services/guest/endChatService'
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
  receiveChatMessage: (messageBody: any) => void,
  clearGuestStore: () => void,
  disconnect: () => Promise<void>
) {
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/guest/${guestChannelToken}`

  const router = useRouter()

  const messageHandlers = new Map<
    (message: any) => boolean,
    (message: any) => void
  >([
    [isChatMessageCapsule, receiveChatMessage],
    [isTerminate, handleTerminate],
    [
      isErrorMessage,
      message => {
        // TODO: display error notification on screen
      },
    ],
  ])

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      stompClient.subscribe(WS_RECEIVE_URL, receive)
    }
  }

  function receive(message: IMessage) {
    const messageBody = JSON.parse(message.body)
    handleWithMatchedHandler(messageBody, messageHandlers)
  }

  function handleTerminate(terminate: Terminate) {
    disconnect()
    endChatService(guestChannelToken!)
      .then(response => {
        clearGuestStore()
        sessionStorage.clear()
        router.push('/guest/ended?byWho=host')
      })
      .catch(error => {
        clearGuestStore()
        sessionStorage.clear()
        router.push('/guest/ended?byWho=host')
      })
  }

  return {
    onConnect,
  }
}
