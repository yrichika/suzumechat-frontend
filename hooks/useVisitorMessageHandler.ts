import { Client, IFrame, IMessage } from '@stomp/stompjs'
import { isAuthenticationStatus, isError } from '@utils/WebSocketMessageHelper'
import { useEffect, useState } from 'react'
import AuthenticationStatus from 'types/messages/AuthenticationStatus'
import JoinRequest from 'types/messages/JoinRequest'
import { connect, isInactive } from './stomp/config'

export default function useVisitorMessageHandler(joinChannelToken: string) {
  const [stompClient, setStompClient] = useState<Client>()
  const WS_ENDPOINT_URL = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/${process.env.NEXT_PUBLIC_WS_ENDPOINT}`
  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/visitor/${joinChannelToken}`
  const [visitorId, setVisitorId] = useState('')
  // WARNING!
  function wsReceiveUrl(visitorId: string) {
    return `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/visitor/${joinChannelToken}/${visitorId}`
  }

  const [isClosed, setIsClosed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [guestChannelToken, setGuestChannelToken] = useState('')

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
    setIsAuthenticated(authStatus.isAuthenticated)
    setGuestChannelToken(authStatus.guestChannelToken)
    disconnect()
  }

  function sendJoinRequest(joinRequest: JoinRequest) {
    if (isInactive(stompClient)) {
      return
    }
    stompClient!.publish({
      destination: WS_SEND_URL,
      body: JSON.stringify(joinRequest),
    })
    console.log('message sent:' + JSON.stringify(joinRequest))
  }

  function disconnect() {
    if (isInactive(stompClient)) {
      return
    }
    stompClient!.deactivate()
    console.log('websocket disconnected')
  }

  useEffect(() => {
    connect(setStompClient, onConnect, WS_ENDPOINT_URL)
  }, [])

  return {
    visitorId,
    guestChannelToken,
    isClosed,
    isAuthenticated,
    sendJoinRequest,
  }
}
