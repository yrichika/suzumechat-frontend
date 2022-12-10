import useGuestStore from '@stores/useGuestStore'
import useVisitorGuestSharedStompClientStore from '@stores/useVisitorGuestSharedStompClientStore'
import { sanitizeText } from '@utils/Util'
import { useEffect, useState } from 'react'
import JoinRequest from 'types/messages/JoinRequest'
import useVisitorReceiver from '../../receivers/useVisitorReceiver'
import { connect, isInactive } from '../../stomp/config'
import { box } from 'tweetnacl'
import { encrypt } from '@hooks/utils/PublicKeyEncryption'
import WhoIAm from 'types/messages/WhoIAm'
import { encode as encodeBase64 } from '@stablelib/base64'

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

  // REFACTOR: useVisitorSenderに移す
  function sendJoinRequest(codename: string, passphrase: string) {
    const safeCodename = sanitizeText(codename)
    const safePassphrase = sanitizeText(passphrase)
    setCodename(safeCodename)
    const visitorSendingKey = box.before(
      hostPublicKey,
      publicKeyEncKeyPair.secretKey
    )
    const whoIAm: WhoIAm = {
      codename: safeCodename,
      passphrase: safePassphrase,
    }
    const whoIAmEnc = encrypt(visitorSendingKey, whoIAm)
    const publicKeyString = encodeBase64(publicKeyEncKeyPair.publicKey)
    const joinRequest: JoinRequest = {
      visitorId: visitorId,
      visitorPublicKey: publicKeyString,
      whoIAmEnc,
    }
    if (isInactive(stompClient)) {
      return
    }

    stompClient!.publish({
      destination: WS_SEND_URL,
      body: JSON.stringify(joinRequest),
    })
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
    guestChannelToken,
    isClosed,
    isAuthenticated,
    sendJoinRequest,
    disconnect,
  }
}
