import { pickLangMessage } from '@utils/LanguageSwitch'
import React, { useEffect, useState } from 'react'
import { isEmpty, isNotEmpty } from '@utils/Util'

interface Props {
  isWaitingForAuthentication: boolean
  isAuthenticated: boolean | null
  guestChannelToken: string
  langMap: Map<string, Map<string, string>>
}

function AuthenticationStatus({
  isWaitingForAuthentication,
  isAuthenticated,
  guestChannelToken,
  langMap,
}: Props) {
  const guestChannelUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}/guest/`
  // messages
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

  function guestChatUrl(validGuestChannelToken: string): string {
    return guestChannelUrl + validGuestChannelToken
  }

  return (
    // REFACTOR: too much nesting ifs
    <div className="flex justify-center mt-5 mx-2">
      {!isWaitingForAuthentication ? (
        <span>
          <span data-lang="send-auth">{defaultMessage}</span>
        </span>
      ) : (
        <span className="break-all">
          {/* ACCEPTED message */}
          {isAuthenticated === true && (
            <span>
              <span className="font-bold" data-lang="accepted">
                {acceptedMessage}
              </span>
              <span>: </span>
              <a
                href={guestChatUrl(guestChannelToken)}
                className="underline text-blue-500 break-all overflow-ellipsis"
              >
                {guestChatUrl(guestChannelToken)}
              </a>
            </span>
          )}
          {/* REJECTED message */}
          {isAuthenticated === false && (
            <span data-lang="rejected">{rejectedMessage}</span>
          )}
          {/* WAITING message */}
          {isAuthenticated === null && (
            <span data-lang="waiting-for-authentication">{waitingMessage}</span>
          )}
        </span>
      )}
    </div>
  )
}

export default AuthenticationStatus
