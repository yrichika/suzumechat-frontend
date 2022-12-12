import useGuestStore from '@stores/useGuestStore'
import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'
import { useEffect, useState } from 'react'
import useVisitorReceiver from '../../receivers/useVisitorReceiver'
import { connect, isInactive } from '../../stomp/config'
import useVisitorSender from '@hooks/senders/useVisitorSender'

export default function useVisitorMessageHandler(joinChannelToken: string) {
  const stompClient = useVisitorGuestSharedStompClientStore(
    store => store.stompClient
  )

  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/visitor/${joinChannelToken}`
  const { isClosed, isAuthenticated, guestChannelToken, visitorId, onConnect } =
    useVisitorReceiver(joinChannelToken)
  const hostPublicKey = useGuestStore(store => store.hostPublicKey)
  const publicKeyEncKeyPair = useGuestStore(store => store.publicKeyEncKeyPair)
  const setCodename = useGuestStore(store => store.setCodename)

  const { sendJoinRequest } = useVisitorSender(
    stompClient,
    WS_SEND_URL,
    visitorId,
    publicKeyEncKeyPair,
    hostPublicKey,
    setCodename
  )

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
    guestChannelToken,
    isClosed,
    isAuthenticated,
    sendJoinRequest,
    disconnect,
  }
}
