import { isNotEmpty } from '@utils/Util'
import { useEffect, useState } from 'react'
import AuthenticationStatus from 'types/AuthenticationStatus'

export default function useReceiveAuthenticationStatus(
  joinChannelToken: string
) {
  const sseUrl = `${process.env.NEXT_PUBLIC_BACK_URL}/visitor/joinStatus/${joinChannelToken}`
  const [eventSource, setEventSource] = useState<EventSource>()
  // originally clientChannel
  const [guestChannelToken, setGuestChannelToken] = useState('')

  useEffect(() => {
    // Stop SSE if guestChannelToken is filled with non empty value
    if (guestChannelToken !== '') {
      eventSource?.close()
    }
  }, [guestChannelToken, eventSource])

  function receiveStatus() {
    const eventSource = new EventSource(sseUrl, { withCredentials: true })
    eventSource.onmessage = receiveAuthentication
    setEventSource(eventSource)
  }

  // originally: sseMessageEvent
  function receiveAuthentication(authentication: MessageEvent<any>): void {
    const authStatus: AuthenticationStatus = JSON.parse(authentication.data)

    if (authStatus.isClosed) {
      // TODO: 1. 「このチャンネルでの受付は終了しました」を表示させる
      eventSource?.close()
      return
    }

    if (authStatus.isAuthenticated === null) {
      // just waiting. do nothing.
      return
    }
    if (authStatus.isAuthenticated === false) {
      // TODO: 1.「拒否されました」の表示を出す
      // 2. SSEを停止させる
      eventSource?.close()
      // 3. early return
      return
    }

    setGuestChannelToken(authStatus.guestChannelToken)
  }

  return { eventSource, receiveStatus, guestChannelToken }
}
