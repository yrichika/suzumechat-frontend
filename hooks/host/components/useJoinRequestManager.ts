import useJoinRequestAvailabilityStore from '@stores/host/useJoinRequestAvailabilityStore'
import { useEffect } from 'react'

export default function useJoinRequestManager(
  hostChannelToken: string,
  isChannelEnded: boolean,
  sendCloseJoinRequest: () => void,
  disableSendingManageableJoinRequest: () => void
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
    const baseStyle = 'text-sm px-2 text-white rounded-full '
    const acceptedStyle = 'border-green-500 bg-green-500 '
    const rejectedStyle = 'border-red-500 bg-red-500 '
    return isAuthenticated
      ? baseStyle + acceptedStyle
      : baseStyle + rejectedStyle
  }

  function closeJoinRequest() {
    sendCloseJoinRequest()
    setRequestClosed(true) // TEST: it's not tested right yet
    disableSendingManageableJoinRequest()
  }

  return {
    requestClosed,
    showStatus,
    writeStatusClass,
    closeJoinRequest,
  }
}
