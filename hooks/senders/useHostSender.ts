import { isInactive } from '@hooks/stomp/config'
import { Client } from '@stomp/stompjs'
import Terminate from 'types/messages/Terminate'

export default function useHostSender(stompClient: Client, wsSendUrl: string) {
  function sendTerminateMessage() {
    // TODO: handle this message on guest side
    const CHANNEL_ENDED_MESSAGE = '__channel_ended__'
    const terminateMessage: Terminate = {
      terminatedBy: 'host',
      message: CHANNEL_ENDED_MESSAGE,
      data: null,
    }
    stompClient?.publish({
      destination: wsSendUrl,
      body: JSON.stringify(terminateMessage),
    })
  }

  return { sendTerminateMessage }
}
