import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isChatMessageCapsule,
  isErrorMessage,
  isTerminate,
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
    // WORKING: #29
    console.log('received terminate message!')
    // 1. websocket disconnect
    // 2. storeのデータを削除
    // 3. guestのbackendにリクエストを投げて、(`/back/guest/invalidateSession/${guestChannelToken}`)
    //    backendで httpSession.invalidate() を実行させる
    // 4. redirect to chat ended page: show message like "Channel is closed by host"
  }

  return {
    onConnect,
  }
}
