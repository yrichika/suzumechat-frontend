import React from 'react'
import useAuthenticationStatus from '@hooks/pages/visitor/useAuthenticationStatus'

interface Props {
  isWaitingForAuthentication: boolean
  isAuthenticated: boolean | null
  langMap: Map<string, Map<string, string>>
}

function AuthenticationStatus({
  isWaitingForAuthentication,
  isAuthenticated,
  langMap,
}: Props) {
  const { defaultMessage, acceptedMessage, rejectedMessage, waitingMessage } =
    useAuthenticationStatus(langMap)

  return (
    <div className="flex justify-center mt-5 mx-2">
      {!isWaitingForAuthentication ? (
        <span>
          <span data-lang="send-auth">{defaultMessage}</span>
        </span>
      ) : (
        <span className="break-all">
          {/* ACCEPTED message */}
          {isAuthenticated === true && (
            <span className="font-bold" data-lang="accepted">
              {acceptedMessage}
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
