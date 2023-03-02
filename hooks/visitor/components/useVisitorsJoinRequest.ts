import setGuestSessionService from '@services/visitor/setGuestSessionService'
import { pickLangMessage } from '@utils/LanguageSwitch'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BoxKeyPair } from 'tweetnacl'
import useVisitorMessageHandler from '../messagehandlers/useVisitorMessageHandler'

export default function useVisitorsJoinRequest(
  guestId: string,
  joinChannelToken: string,
  hostPublicKey: Uint8Array,
  publicKeyEncKeyPair: BoxKeyPair,
  setChannelName: (channelName: string) => void,
  setGuestId: (guestId: string) => void,
  setCodename: (codename: string) => void,
  setSecretKey: (secretKey: string) => void,
  langMap: Map<string, Map<string, string>>
) {
  const router = useRouter()

  const [codenameInput, setCodenameInput] = useState('')
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
  } = useVisitorMessageHandler(
    joinChannelToken,
    hostPublicKey,
    publicKeyEncKeyPair,
    setChannelName,
    setGuestId,
    setCodename,
    setSecretKey
  )

  useEffect(() => {
    setErrorChatClosedMessage(pickLangMessage('chat-closed', langMap))
  }, [])

  // TODO: not sure this useEffect is at the right location.
  // reconsider if there is a better place for this useEffect.
  useEffect(() => {
    if (isAuthenticated === true) {
      disconnect().then(() => {
        setGuestSessionService(guestId, guestChannelToken)
          .then(response => {
            router.push(`/guest/chat/${guestChannelToken}`)
          })
          .catch(error => {
            // TODO: show a page that tells authentication failed
            sessionStorage.clear()
          })
      })
    }
  }, [isAuthenticated])

  function send() {
    sendJoinRequest(codenameInput, passphrase)
    setIsWaitingForAuthentication(true)
  }

  return {
    isClosed,
    errorChatClosedMessage,
    codenameInput,
    setCodenameInput,
    isWaitingForAuthentication,
    passphrase,
    setPassphrase,
    send,
    isAuthenticated,
  }
}
