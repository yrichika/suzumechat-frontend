import { Client, IFrame, IMessage } from '@stomp/stompjs'
import {
  isAuthenticationStatus,
  isJoinRequestClosed,
  isErrorMessage,
} from '@utils/WebSocketMessageHelper'
import { useState } from 'react'
import AuthenticationStatus from 'types/messages/AuthenticationStatus'

// DO NOT include stompjs `Client` in this function.
// this function is to separate functions from the functions using Client object.
export default function useVisitorReceiver(
  stompClient: Client,
  joinChannelToken: string,
  setGuestId: (guestId: string) => void,
  setChannelName: (channelName: string) => void,
  setSecretKey: (secretKey: string) => void
) {
  const [isClosed, setIsClosed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [guestChannelToken, setGuestChannelToken] = useState('')
  const [visitorId, setVisitorId] = useState('')

  function wsReceiveUrl(visitorId: string) {
    return `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/visitor/${joinChannelToken}/${visitorId}`
  }

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      const visitorId = crypto.randomUUID()
      setVisitorId(visitorId)
      stompClient.subscribe(wsReceiveUrl(visitorId), receive)
    }
  }

  function receive(message: IMessage) {
    const messageBody = JSON.parse(message.body)
    if (isJoinRequestClosed(messageBody)) {
      handleJoinRequestClosed()
    } else if (isAuthenticationStatus(messageBody)) {
      handleAuthenticationStatusMessage(messageBody)
    } else if (isErrorMessage(messageBody)) {
      // TODO: handle error
    }
  }

  function handleAuthenticationStatusMessage(authStatus: AuthenticationStatus) {
    setIsClosed(authStatus.isClosed) // DELETE:
    setGuestChannelToken(authStatus.guestChannelToken)
    setGuestId(authStatus.guestId)
    setChannelName(authStatus.channelName) // FIXME: move to more appropriate location
    setSecretKey(authStatus.secretKey)
    // isAuthenticated has to be last to be updated
    // because it's used to redirect to chat page after all other
    // guest data is set.
    setIsAuthenticated(authStatus.isAuthenticated)
  }

  function handleJoinRequestClosed() {
    setIsClosed(true)
    // FIXME: duplicate of `disconnect()`
    if (stompClient.active) {
      stompClient.deactivate()
    }
    sessionStorage.clear()
  }

  return {
    isClosed,
    isAuthenticated,
    guestChannelToken,
    visitorId,
    onConnect,
  }
}
