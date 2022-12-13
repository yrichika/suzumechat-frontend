import setGuestSessionService from '@services/setGuestSessionService'
import useGuestStore from '@stores/useGuestStore'
import { pickLangMessage } from '@utils/LanguageSwitch'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useVisitorMessageHandler from './useVisitorMessageHandler'
import { decode as decodeBase64 } from '@stablelib/base64'

export default function useVisitorsJoinRequest(
  joinChannelToken: string,
  hostPublicKey: string,
  langMap: Map<string, Map<string, string>>
) {
  const router = useRouter()
  const guestId = useGuestStore(state => state.guestId)
  const clearGuestStore = useGuestStore(state => state.clear)
  const initPublicKeyEncKeyPair = useGuestStore(
    store => store.initPublicKeyEncKeyPair
  )
  const setHostPublicKey = useGuestStore(store => store.setHostPublicKey)

  const [codename, setCodename] = useState('')
  const [isWaitingForAuthentication, setIsWaitingForAuthentication] =
    useState(false)
  const [passphrase, setPassphrase] = useState('')

  // messages
  const [errorChatClosedMessage, setErrorChatClosedMessage] = useState('')

  const {
    guestChannelToken,
    isClosed,
    isAuthenticated,
    sendJoinRequest,
    disconnect,
  } = useVisitorMessageHandler(joinChannelToken)

  useEffect(() => {
    initPublicKeyEncKeyPair()
    const hostPublicKeyUnit8Array = decodeBase64(hostPublicKey)
    setHostPublicKey(hostPublicKeyUnit8Array)
    setErrorChatClosedMessage(pickLangMessage('chat-closed', langMap))
  }, [])

  useEffect(() => {
    if (isAuthenticated === true) {
      disconnect()?.then(() => {
        setGuestSessionService(guestId, guestChannelToken)
          .then(response => {
            router.push(`/guest/chat/${guestChannelToken}`)
          })
          .catch(error => {
            // TODO: 認証に失敗した表示にする
            clearGuestStore()
          })
      })
    }
  }, [isAuthenticated])

  function send() {
    // TODO: add validation here
    // codename <= 30
    // passphrase <= 400

    sendJoinRequest(codename, passphrase)
    setIsWaitingForAuthentication(true)
  }

  return {
    isClosed,
    errorChatClosedMessage,
    codename,
    setCodename,
    isWaitingForAuthentication,
    passphrase,
    setPassphrase,
    send,
    isAuthenticated,
  }
}
