import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isChatMessageCapsule,
  isErrorMessage,
  isJoinRequest,
} from '@utils/WebSocketMessageHelper'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import JoinRequest from 'types/messages/JoinRequest'

export default function useHostReceiver(
  wsReceiveUrl: string,
  receiveChatMessage: (messageBody: ChatMessageCapsule) => void,
  receiveJoinRequest: (messageBody: JoinRequest) => void
) {
  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      stompClient.subscribe(wsReceiveUrl, receive)
    }
  }

  function receive(message: IMessage) {
    const messageBody = JSON.parse(message.body)
    if (isChatMessageCapsule(messageBody)) {
      receiveChatMessage(messageBody)
    } else if (isJoinRequest(messageBody)) {
      receiveJoinRequest(messageBody)
    } else if (isErrorMessage(messageBody)) {
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
