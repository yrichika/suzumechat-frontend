import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isChatMessageCapsuleMessage,
  isError,
  isManagedJoinRequestMessage,
} from '@utils/WebSocketMessageHelper'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'

export default function useHostReceiver(
  wsReceiveUrl: string,
  receiveChatMessage: (messageBody: ChatMessageCapsule) => void,
  receiveJoinRequest: (messageBody: any) => void
) {
  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      stompClient.subscribe(wsReceiveUrl, receive)
    }
  }

  function receive(message: IMessage) {
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
    receive,
  }
}
