import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'
import { useEffect, useState } from 'react'
import JoinRequest from 'types/messages/JoinRequest'
import useVisitorReceiver from './receivers/useVisitorReceiver'
import { connect, isInactive } from './stomp/config'

export default function useVisitorMessageHandler(joinChannelToken: string) {
  const stompClient = useVisitorGuestSharedStompClientStore(
    store => store.stompClient
  )

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

  useEffect(() => {
    connect(stompClient, onConnect)
  }, [])

  return {
    visitorId,
    guestChannelToken,
    isClosed,
    isAuthenticated,
    sendJoinRequest,
    disconnect,
  }
}
