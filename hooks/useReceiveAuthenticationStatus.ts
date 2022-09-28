import { isNotEmpty } from '@utils/Util'
import { useEffect, useState } from 'react'
import AuthenticationStatus from 'types/AuthenticationStatus'

export default function useReceiveAuthenticationStatus(
  joinChannelToken: string
) {
  const sseUrl = `${process.env.NEXT_PUBLIC_BACK_URL}/visitor/joinStatus/${joinChannelToken}`
  const [eventSource, setEventSource] = useState<EventSource>()
  // originally clientChannel
  const [isClosed, setIsClosed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [guestChannelToken, setGuestChannelToken] = useState('')

  useEffect(() => {
    // Stop SSE if channel closed or already authenticated

    if (isClosed) {
      eventSource?.close()
    }
    if (isAuthenticated !== null) {
      eventSource?.close()
    }
  }, [isClosed, isAuthenticated, eventSource])

  function receiveStatus() {
    const eventSource = new EventSource(sseUrl, { withCredentials: true })
    eventSource.onopen = () => {
      console.log('SSE connection established')
    }
    eventSource.onerror = event => {
      console.warn('there was an error with sse: ' + event)
      eventSource.close()
    }

    eventSource.onmessage = receiveAuthentication
    setEventSource(eventSource)
  }

  // originally: sseMessageEvent
  function receiveAuthentication(authentication: MessageEvent<any>): void {
    const authStatus: AuthenticationStatus = JSON.parse(authentication.data)

    // stopping SSE at the useEffect hook
    setIsClosed(authStatus.isClosed)
    setIsAuthenticated(authStatus.isAuthenticated)
    setGuestChannelToken(authStatus.guestChannelToken)
  }

  return {
    eventSource,
    receiveStatus,
    isClosed,
    setIsClosed,
    isAuthenticated,
    guestChannelToken,
  }
}
