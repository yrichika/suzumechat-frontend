import React from 'react'
import AuthenticationStatus from '@components/visitor/molecules/AuthenticationStatus'
import useVisitorsJoinRequest from '@hooks/visitor/components/useVisitorsJoinRequest'
import { BoxKeyPair } from 'tweetnacl'

interface Props {
  guestId: string
  joinChannelToken: string
  hostPublicKey: Uint8Array
  publicKeyEncKeyPair: BoxKeyPair
  setChannelName: (channelName: string) => void
  setGuestId: (guestId: string) => void
  setCodename: (codename: string) => void
  setSecretKey: (secretKey: string) => void
  langMap: Map<string, Map<string, string>>
}

function VisitorsJoinRequest({
  guestId,
  joinChannelToken,
  hostPublicKey,
  publicKeyEncKeyPair,
  setChannelName,
  setGuestId,
  setCodename,
  setSecretKey,
  langMap,
}: Props) {
  const {
    isClosed,
    errorChatClosedMessage,
    codenameInput,
    setCodenameInput,
    isWaitingForAuthentication,
    passphrase,
    setPassphrase,
    send,
    isAuthenticated,
  } = useVisitorsJoinRequest(
    guestId,
    joinChannelToken,
    hostPublicKey,
    publicKeyEncKeyPair,
    setChannelName,
    setGuestId,
    setCodename,
    setSecretKey,
    langMap
  )

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
                    value={codenameInput}
                    onChange={event => setCodenameInput(event.target.value)}
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
