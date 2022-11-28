import closeJoinRequestService from '@services/closeJoinRequestService'
import useJoinRequestAvailabilityStore from '@stores/useJoinRequestAvailabilityStore'
import { useEffect } from 'react'

export default function useJoinRequestManager(
  hostChannelToken: string,
  isChannelEnded: boolean
) {
  const requestClosed = useJoinRequestAvailabilityStore(state => state.isClosed)
  const setRequestClosed = useJoinRequestAvailabilityStore(
    state => state.setIsClosed
  )
  const resetJoinRequestAvailability = useJoinRequestAvailabilityStore(
    state => state.reset
  )

  useEffect(() => {
    if (isChannelEnded) {
      resetJoinRequestAvailability()
    }
  }, [isChannelEnded])

  // TODO: change this to websocket. otherwise host can't notify others channel already closed
  function closeRequest() {
    closeJoinRequestService(hostChannelToken)
      .then(data => {
        setRequestClosed(true)
      })
      .catch(error => {
        alert('TODO: メッセージをちゃんとする(マルチリンガル)')
      })
  }

  function showStatus(isAuthenticated: null | boolean): string {
    if (isAuthenticated === null) {
      return 'Not Accepted'
    } else if (isAuthenticated === false) {
      return 'Rejected'
    }
    return 'Accepted'
  }

  function writeStatusClass(isAuthenticated: null | boolean): string {
    const baseStyle = 'text-sm px-1 border text-white rounded-full '
    const acceptedStyle = 'border-green-500 bg-green-500 '
    const rejectedStyle = 'border-red-500 bg-red-500 '
    return isAuthenticated
      ? baseStyle + acceptedStyle
      : baseStyle + rejectedStyle
  }

  return {
    requestClosed,
    closeRequest,
    showStatus,
    writeStatusClass,
  }
}
