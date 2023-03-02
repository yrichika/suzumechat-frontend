import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'
import { useEffect } from 'react'
import { BoxKeyPair } from 'tweetnacl'
import { connect, isInactive } from '../../stomp/config'
import useVisitorReceiver from './receivers/useVisitorReceiver'
import useVisitorSender from './senders/useVisitorSender'

export default function useVisitorMessageHandler(
  joinChannelToken: string,
  hostPublicKey: Uint8Array,
  publicKeyEncKeyPair: BoxKeyPair,
  setChannelName: (channelName: string) => void,
  setGuestId: (guestId: string) => void,
  setCodename: (codename: string) => void,
  setSecretKey: (secretKey: string) => void
) {
  const stompClient = useVisitorGuestSharedStompClientStore(
    store => store.stompClient
  )

  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/visitor/${joinChannelToken}`

  const { isClosed, isAuthenticated, guestChannelToken, visitorId, onConnect } =
    useVisitorReceiver(
      stompClient,
      joinChannelToken,
      setGuestId,
      setChannelName,
      setSecretKey
    )

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
