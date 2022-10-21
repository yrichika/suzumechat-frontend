import useJoinRequestReceiver from '@hooks/receivers/useJoinRequestReceiver'
import useApprovalSender from '@hooks/senders/useApprovalSender'
import { Client } from '@stomp/stompjs'
import ManagedJoinRequest from 'types/messages/ManagedJoinRequest'

export default function useJoinRequestMessageHandler(
  stompClient: Client,
  wsSendUrl: string,
  addJoinRequest: (newRequest: ManagedJoinRequest) => void,
  updateRequest: (request: ManagedJoinRequest) => void
) {
  const { receiveJoinRequest } = useJoinRequestReceiver(addJoinRequest)
  const { sendApproval } = useApprovalSender(
    stompClient,
    wsSendUrl,
    updateRequest
  )

  return {
    sendApproval,
    receiveJoinRequest,
  }
}
