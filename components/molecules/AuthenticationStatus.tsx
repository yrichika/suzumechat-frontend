import { pickLangMessage } from '@utils/LanguageSwitch'
import React, { useEffect, useState } from 'react'
import { isEmpty } from '@utils/Util'

interface Props {
  isWaitingForAuthentication: boolean
  langMap: Map<string, Map<string, string>>
}

function AuthenticationStatus({ isWaitingForAuthentication, langMap }: Props) {
  const rejectedStatusMessage = '__rejected__'
  const chatUrl = '/guest/'
  // messages
  const [defaultMessage, setDefaultMessage] = useState('')
  const [rejectedMessage, setRejectedMessage] = useState('')
  const [acceptedMessage, setAcceptedMessage] = useState('')
  const [waitingMessage, setWaitingMessage] = useState('')

  // originally clientChannel
  const [guestChannelToken, setGuestChannelToken] = useState(null)

  useEffect(() => {
    setDefaultMessage(pickLangMessage('send-auth', langMap))
    setRejectedMessage(pickLangMessage('rejected', langMap))
    setAcceptedMessage(pickLangMessage('accepted', langMap))
    setWaitingMessage(pickLangMessage('waiting-for-authentication', langMap))
  }, [])

  function guestChatUrl(validGuestChannelToken: string | null): string {
    if (isEmpty(validGuestChannelToken)) {
      throw 'Guest channel token is empty.'
    }
    return chatUrl + validGuestChannelToken
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
          {guestChannelToken ? (
            <>
              {guestChannelToken === rejectedStatusMessage ? (
                <span data-lang="rejected">{rejectedMessage}</span>
              ) : (
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
            </>
          ) : (
            <span data-lang="waiting-for-authentication">{waitingMessage}</span>
          )}
        </span>
      )}
    </div>
  )
}

export default AuthenticationStatus
