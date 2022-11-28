import setGuestSessionService from '@services/setGuestSessionService'
import useGuestStore from '@stores/useGuestStore'
import { pickLangMessage } from '@utils/LanguageSwitch'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useVisitorMessageHandler from './useVisitorMessageHandler'

export default function useVisitorsJoinRequest(
  joinChannelToken: string,
  langMap: Map<string, Map<string, string>>
) {
  const router = useRouter()
  const guestId = useGuestStore(state => state.guestId)
  const clearGuestStore = useGuestStore(state => state.clear)

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
    // TODO: backendに問い合わせて、すでにchannelが閉じていないか確認
    // 閉じていたら、すでに閉じている表示をさせる
  }, [])

  useEffect(() => {
    if (isAuthenticated === true) {
      disconnect()?.then(() => {
        setGuestSessionService(guestId, guestChannelToken)
          .then(response => {
            router.push(`/guest/${guestChannelToken}`)
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
