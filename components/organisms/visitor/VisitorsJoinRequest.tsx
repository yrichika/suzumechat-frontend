import React, { useEffect, useState } from 'react'
import { pickLangMessage } from '@utils/LanguageSwitch'
import { langMap } from '@lang/index/langMap'
import AuthenticationStatus from '@components/molecules/visitor/AuthenticationStatus'
import useVisitorMessageHandler from '@hooks/useVisitorMessageHandler'
import { useRouter } from 'next/router'
import setGuestSessionService from '@services/setGuestSessionService'
import useGuestStore from '@stores/useGuestStore'

interface Props {
  joinChannelToken: string
  langMap: Map<string, Map<string, string>>
}

function VisitorsJoinRequest({ joinChannelToken, langMap }: Props) {
  // REFACTOR: move most of variables and functions to this parent
  const router = useRouter()
  const guestId = useGuestStore(state => state.guestId)
  const clearGuestStore = useGuestStore(state => state.clear)

  const {
    visitorId,
    guestChannelToken,
    isClosed,
    isAuthenticated,
    sendJoinRequest,
    disconnect,
  } = useVisitorMessageHandler(joinChannelToken)

  const [codename, setCodename] = useState('')
  const [isWaitingForAuthentication, setIsWaitingForAuthentication] =
    useState(false)
  const [passphrase, setPassphrase] = useState('')

  // messages
  const [errorChatClosedMessage, setErrorChatClosedMessage] = useState('')

  useEffect(() => {
    setErrorChatClosedMessage(pickLangMessage('chat-closed', langMap))
    // TODO: backendに問い合わせて、すでにchannelが閉じていないか確認
    // 閉じていたら、すでに閉じている表示をさせる
  }, [])

  // REFACTOR: move to the parent
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
    const joinRequest = {
      visitorId: visitorId,
      codename: codename,
      passphrase: passphrase,
    }
    // TODO: encrypt joinRequest message by asymmetric keys
    sendJoinRequest(joinRequest)
    setIsWaitingForAuthentication(true)
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
                className={
                  'btn btn-blue' +
                  (isWaitingForAuthentication ? ' btn-disabled' : '')
                }
                data-lang="send-request-button"
                onClick={send}
                disabled={isWaitingForAuthentication}
              ></button>
            </div>
          </div>
          <hr />
          <AuthenticationStatus
            isWaitingForAuthentication={isWaitingForAuthentication}
            isAuthenticated={isAuthenticated}
            langMap={langMap}
          />
        </div>
      )}
    </div>
  )
}

export default VisitorsJoinRequest
