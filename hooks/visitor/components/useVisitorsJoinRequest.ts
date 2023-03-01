import setGuestSessionService from '@services/visitor/setGuestSessionService'
import { pickLangMessage } from '@utils/LanguageSwitch'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useVisitorMessageHandler from '../messagehandlers/useVisitorMessageHandler'

export default function useVisitorsJoinRequest(
  joinChannelToken: string,
  guestId: string,
  langMap: Map<string, Map<string, string>>
) {
  const router = useRouter()

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
    setErrorChatClosedMessage(pickLangMessage('chat-closed', langMap))
  }, [])

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
