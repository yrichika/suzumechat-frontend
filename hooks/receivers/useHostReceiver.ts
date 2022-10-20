import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isChatMessageCapsuleMessage,
  isError,
  isManagedJoinRequestMessage,
} from '@utils/WebSocketMessageHelper'

export default function useHostReceiver(
  wsReceiveUrl: string,
  receiveChatMessage: any,
  receiveJoinRequest: any
) {
  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      console.log('chat ws connected!')
      stompClient.subscribe(wsReceiveUrl, receive)
    }
  }

  function receive(message: IMessage) {
    console.log('received message: ' + message.body)
    const messageBody = JSON.parse(message.body)
    if (isChatMessageCapsuleMessage(messageBody)) {
      receiveChatMessage(messageBody)
    } else if (isManagedJoinRequestMessage(messageBody)) {
      receiveJoinRequest(messageBody)
    } else if (isError(messageBody)) {
      // TODO: display error notification on screen
    } else {
      // TODO: display error notification on screen
    }
  }

  return {
    onConnect,
  }
}
