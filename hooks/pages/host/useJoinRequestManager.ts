import useJoinRequestAvailabilityStore from '@stores/useJoinRequestAvailabilityStore'
import { useEffect } from 'react'

export default function useJoinRequestManager(
  hostChannelToken: string,
  isChannelEnded: boolean,
  sendCloseJoinRequest: () => void
) {
  const requestClosed = useJoinRequestAvailabilityStore(state => state.isClosed)
  const setRequestClosed = useJoinRequestAvailabilityStore(
    state => state.setIsClosed
  )
  const clearJoinRequestAvailability = useJoinRequestAvailabilityStore(
    state => state.clear
  )

  useEffect(() => {
    if (isChannelEnded) {
      clearJoinRequestAvailability()
    }
  }, [isChannelEnded])

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

  function closeJoinRequest() {
    sendCloseJoinRequest()
    setRequestClosed(true)
  }

  return {
    requestClosed,
    showStatus,
    writeStatusClass,
    closeJoinRequest,
  }
}
