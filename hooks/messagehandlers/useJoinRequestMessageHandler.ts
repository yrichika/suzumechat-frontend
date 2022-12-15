import useJoinRequestReceiver from '@hooks/receivers/useJoinRequestReceiver'
import useApprovalSender from '@hooks/senders/useApprovalSender'
import { Client } from '@stomp/stompjs'
import CloseJoinRequest from 'types/messages/CloseJoinRequest'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'

export default function useJoinRequestMessageHandler(
  stompClient: Client,
  wsSendUrl: string,
  hostSecretKey: Uint8Array,
  addManageableJoinRequest: (newRequest: ManageableJoinRequest) => void,
  updateManageableRequest: (request: ManageableJoinRequest) => void
) {
  const { receiveJoinRequest } = useJoinRequestReceiver(
    addManageableJoinRequest,
    hostSecretKey
  )
  const { sendApproval } = useApprovalSender(
    stompClient,
    wsSendUrl,
    updateManageableRequest
  )

  function sendCloseJoinRequest() {
    if (!stompClient.active) {
      return
    }
    const channelClosed: CloseJoinRequest = {
      joinRequestClosing: true,
    }
    stompClient.publish({
      destination: wsSendUrl,
      body: JSON.stringify(channelClosed),
    })
  }

  return {
    sendApproval,
    sendCloseJoinRequest,
    receiveJoinRequest,
  }
}
