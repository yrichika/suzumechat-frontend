import { Client, IFrame, IMessage } from '@stomp/stompjs'
import useGuestStore from '@stores/useGuestStore'
import { isAuthenticationStatus, isError } from '@utils/WebSocketMessageHelper'
import { useEffect, useState } from 'react'
import AuthenticationStatus from 'types/messages/AuthenticationStatus'
import JoinRequest from 'types/messages/JoinRequest'
import useVisitorReceiver from './receivers/useVisitorReceiver'
import {
  connect,
  isInactive,
  stompBasicConfig,
  webSocketFactory,
} from './stomp/config'

export default function useVisitorMessageHandler(joinChannelToken: string) {
  const [stompClient, setStompClient] = useState<Client>()
  const WS_ENDPOINT_URL = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/${process.env.NEXT_PUBLIC_WS_ENDPOINT}`
  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/visitor/${joinChannelToken}`
  const { isClosed, isAuthenticated, guestChannelToken, visitorId, onConnect } =
    useVisitorReceiver(joinChannelToken)

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

  function disconnect(): Promise<void> {
    if (isInactive(stompClient)) {
      return new Promise(() => {})
    }
    return stompClient!.deactivate()
  }

  function switchConnectionToGuest() {
    stompClient?.configure({
      ...stompBasicConfig,
      // FIXME: webSocketFactoryは同じなので、再指定しなくてもいい
      webSocketFactory: webSocketFactory(`/back/websocket`),
      // ここだけ上書きになるので、もともとのconfigを上書きできないか?
      onConnect: (frame: IFrame) => {
        console.log('guest chat ws connected')
        stompClient.subscribe(
          `/receive/guest/${guestChannelToken}`,
          (message: IMessage) => {
            console.log('受け取り', message)
          }
        )
      },
    })

    stompClient!.activate()
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
    disconnect,
    switchConnectionToGuest,
  }
}
