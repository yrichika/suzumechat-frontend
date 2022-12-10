import { isInactive } from '@hooks/stomp/config'
import { Client } from '@stomp/stompjs'
import VisitorsAuthStatus from 'types/messages/VisitorsAuthStatus'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'

export default function useApprovalSender(
  stompClient: Client,
  wsSendUrl: string,
  updateManageableJoinRequest: (request: ManageableJoinRequest) => void
) {
  function sendApproval(
    request: ManageableJoinRequest,
    isAuthenticated: boolean
  ) {
    if (isInactive(stompClient)) {
      return
    }
    const auth: VisitorsAuthStatus = {
      visitorId: request.visitorId,
      isAuthenticated: isAuthenticated,
    }
    stompClient.publish({
      destination: wsSendUrl,
      body: JSON.stringify(auth),
    })

    request.isAuthenticated = isAuthenticated
    updateManageableJoinRequest(request)
  }

  return {
    sendApproval,
  }
}
