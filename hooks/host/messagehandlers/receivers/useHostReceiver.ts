import { handleWithMatchedHandler } from '@hooks/utils/Messaging'
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
  const messageHandlers = new Map<
    (message: any) => boolean,
    (message: any) => void
  >([
    [isChatMessageCapsule, receiveChatMessage],
    [isJoinRequest, receiveJoinRequest],
    [
      isErrorMessage,
      message => {
        // TODO: display error notification on screen
      },
    ],
  ])

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      stompClient.subscribe(wsReceiveUrl, receive)
    }
  }

  function receive(message: IMessage) {
    const messageBody = JSON.parse(message.body)
    handleWithMatchedHandler(messageBody, messageHandlers)
  }

  return {
    onConnect,
    receive,
  }
}
