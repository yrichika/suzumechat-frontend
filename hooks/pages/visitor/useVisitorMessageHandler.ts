import useVisitorSender from '@hooks/senders/useVisitorSender'
import useGuestStore from '@stores/guest/useGuestStore'
import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'
import { useEffect } from 'react'
import useVisitorReceiver from '../../receivers/useVisitorReceiver'
import { connect, isInactive } from '../../stomp/config'

export default function useVisitorMessageHandler(joinChannelToken: string) {
  const stompClient = useVisitorGuestSharedStompClientStore(
    store => store.stompClient
  )
  const setGuestId = useGuestStore(state => state.setGuestId)
  const setChannelName = useGuestStore(store => store.setChannelName)
  const setSecretKey = useGuestStore(store => store.setSecretKey)
  const hostPublicKey = useGuestStore(store => store.hostPublicKey)
  const publicKeyEncKeyPair = useGuestStore(store => store.publicKeyEncKeyPair)
  const setCodename = useGuestStore(store => store.setCodename)

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
