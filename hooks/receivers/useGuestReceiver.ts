import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isChatMessageCapsuleMessage,
  isError,
  isTerminateMessage,
} from '@utils/WebSocketMessageHelper'
import Terminate from 'types/messages/Terminate'

export default function useGuestReceiver(
  guestChannelToken: string,
  receiveChatMessage: (messageBody: any) => void
) {
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/guest/${guestChannelToken}`

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      console.log('guest chat ws connected')
      stompClient.subscribe(WS_RECEIVE_URL, receive)
    }
  }

  function receive(message: IMessage) {
    console.log('received message:' + message.body)
    const messageBody = JSON.parse(message.body)
    if (isChatMessageCapsuleMessage(messageBody)) {
      receiveChatMessage(messageBody)
    } else if (isTerminateMessage(messageBody)) {
      handleTerminate(messageBody)
    } else if (isError(messageBody)) {
      // TODO: display error notification on screen
    } else {
      // TODO: display error notification on screen
    }
  }

  function handleTerminate(terminate: Terminate) {
    // 1. websocket disconnect
    // 2. storeのデータを削除
    // 3. guestのbackendにリクエストを投げて、(`/back/guest/invalidateSession/${guestChannelToken}`)
    //    backendで httpSession.invalidate() を実行させる
    // 4. redirect to chat ended page
  }

  return {
    onConnect,
  }
}
