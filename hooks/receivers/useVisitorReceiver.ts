import { Client, IFrame, IMessage } from '@stomp/stompjs'
import useGuestStore from '@stores/useGuestStore'
import { isAuthenticationStatus, isError } from '@utils/WebSocketMessageHelper'
import { useState } from 'react'
import AuthenticationStatus from 'types/messages/AuthenticationStatus'

// DO NOT include stompjs `Client` in this function.
// this function is to separate functions from the functions using Client object.
export default function useVisitorReceiver(joinChannelToken: string) {
  const [isClosed, setIsClosed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [guestChannelToken, setGuestChannelToken] = useState('')
  const [visitorId, setVisitorId] = useState('')
  const setGuestId = useGuestStore(state => state.setGuestId)
  const setChannelName = useGuestStore(store => store.setChannelName)
  const setCodename = useGuestStore(store => store.setCodename)
  const setSecretKey = useGuestStore(store => store.setSecretKey)

  function wsReceiveUrl(visitorId: string) {
    return `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/visitor/${joinChannelToken}/${visitorId}`
  }

  function onConnect(stompClient: Client) {
    return (frame: IFrame) => {
      const visitorId = crypto.randomUUID()
      setVisitorId(visitorId)
      console.log('visitor ws connected!')
      console.log('receiving at: ' + wsReceiveUrl(visitorId))
      stompClient.subscribe(wsReceiveUrl(visitorId), receive)
    }
  }

  function receive(message: IMessage) {
    console.log('message received: ' + message.body)
    const messageBody = JSON.parse(message.body)
    if (isAuthenticationStatus(messageBody)) {
      handleAuthenticationStatusMessage(messageBody)
    } else if (isError(messageBody)) {
      // TODO: handle error
    }
  }

  function handleAuthenticationStatusMessage(authStatus: AuthenticationStatus) {
    setIsClosed(authStatus.isClosed)
    setGuestChannelToken(authStatus.guestChannelToken)
    setGuestId(authStatus.guestId)
    setChannelName(authStatus.channelName)
    setCodename(authStatus.codename)
    setSecretKey(authStatus.secretKey)
    // isAuthenticated has to be last to be updated
    // because it's used to redirect to chat page after all other
    // guest data is set.
    setIsAuthenticated(authStatus.isAuthenticated)
  }

  return {
    isClosed,
    isAuthenticated,
    guestChannelToken,
    visitorId,
    onConnect,
  }
}
