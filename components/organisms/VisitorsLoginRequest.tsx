import React, { useEffect, useState } from 'react'
import { pickLangMessage } from '@utils/LanguageSwitch'
import { langMap } from '@lang/index/langMap'
import { isEmpty } from '@utils/Util'
import AuthenticationStatus from '@components/molecules/AuthenticationStatus'

interface Props {
  langMap: Map<string, Map<string, string>>
}

function VisitorsLoginRequest({ langMap }: Props) {
  const sseUrl = ''
  const requestUrl = ''

  const [isClosed, setIsClosed] = useState(false)
  const [codename, setCodename] = useState('')
  const [isWaitingForAuthentication, setIsWaitingForAuthentication] =
    useState(false)
  const [passphrase, setPassphrase] = useState('')

  // messages
  const [errorChatClosedMessage, setErrorChatClosedMessage] = useState('')

  useEffect(() => {
    setErrorChatClosedMessage(pickLangMessage('chat-closed', langMap))
  }, [])

  function send() {
    // TODO:
  }

  return (
    <div>
      {isClosed ? (
        <div className="flex justify-center">
          <span data-lang="chat-closed">{errorChatClosedMessage}</span>
        </div>
      ) : (
        <div>
          <div className="justify-center">
            <ul className="mt-4">
              <li className="flex justify-center mb-2">
                <div>
                  <label
                    htmlFor="codename"
                    className="block pl-1"
                    data-lang="input-label-codename"
                  ></label>
                  <input
                    type="text"
                    id="codename"
                    className="wp-text-input px-2 w-auto sm:w-72 disabled:opacity-50"
                    required
                    value={codename}
                    onChange={event => setCodename(event.target.value)}
                    disabled={isWaitingForAuthentication}
                  />
                </div>
              </li>
              <li className="flex justify-center">
                <div>
                  <label
                    htmlFor="passphrase"
                    className="block pl-1"
                    data-lang="input-label-passphrase"
                  ></label>
                  <textarea
                    id="passphrase"
                    rows={3}
                    className="wp-text-input px-2 pt-1 w-auto sm:w-72 disabled:opacity-50"
                    value={passphrase}
                    onChange={event => setPassphrase(event.target.value)}
                    placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    required
                    disabled={isWaitingForAuthentication}
                  ></textarea>
                </div>
              </li>
            </ul>
            <div className="flex justify-center mt-5 mb-5">
              <button
                id="submit-button"
                type="submit"
                className="btn btn-blue"
                data-lang="send-request-button"
                onClick={send}
              ></button>
            </div>
          </div>
          <hr />
          <AuthenticationStatus
            isWaitingForAuthentication={isWaitingForAuthentication}
            langMap={langMap}
          />
        </div>
      )}
    </div>
  )
}

export default VisitorsLoginRequest
