import { isInactive } from '@hooks/stomp/config'
import { Client } from '@stomp/stompjs'
import VisitorsAuthStatus from 'types/messages/VisitorsAuthStatus'
import ManagedJoinRequest from 'types/messages/ManagedJoinRequest'

export default function useApprovalSender(
  stompClient: Client | undefined,
  wsSendUrl: string,
  updateRequest: (request: ManagedJoinRequest) => void
) {
  function sendApproval(request: ManagedJoinRequest, isAuthenticated: boolean) {
    if (isInactive(stompClient)) {
      return
    }
    const auth: VisitorsAuthStatus = {
      visitorId: request.visitorId,
      isAuthenticated: isAuthenticated,
    }
    stompClient!.publish({
      destination: wsSendUrl,
      body: JSON.stringify(auth),
    })

    request.isAuthenticated = isAuthenticated
    updateRequest(request)
  }

  return {
    sendApproval,
  }
}
