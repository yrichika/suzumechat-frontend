import { pickLangMessage } from '@utils/LanguageSwitch'
import { useEffect, useState } from 'react'

export default function useAuthenticationStatus(
  langMap: Map<string, Map<string, string>>
) {
  const [defaultMessage, setDefaultMessage] = useState('')
  const [rejectedMessage, setRejectedMessage] = useState('')
  const [acceptedMessage, setAcceptedMessage] = useState('')
  const [waitingMessage, setWaitingMessage] = useState('')

  useEffect(() => {
    setDefaultMessage(pickLangMessage('send-auth', langMap))
    setRejectedMessage(pickLangMessage('rejected', langMap))
    setAcceptedMessage(pickLangMessage('accepted', langMap))
    setWaitingMessage(pickLangMessage('waiting-for-authentication', langMap))
  }, [])

  return {
    defaultMessage,
    rejectedMessage,
    acceptedMessage,
    waitingMessage,
  }
}
