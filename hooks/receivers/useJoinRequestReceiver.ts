import ManagedJoinRequest from 'types/messages/ManagedJoinRequest'

export default function useJoinRequestReceiver(
  addJoinRequest: (newRequest: ManagedJoinRequest) => void
) {
  function receiveJoinRequest(messageBody: any) {
    addJoinRequest(messageBody)
  }
  return {
    receiveJoinRequest,
  }
}
