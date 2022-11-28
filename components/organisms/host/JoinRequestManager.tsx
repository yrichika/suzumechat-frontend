import React from 'react'
import ManagedJoinRequest from 'types/messages/ManagedJoinRequest'
import useJoinRequestManager from '@hooks/pages/host/useJoinRequestManager'

interface Props {
  hostChannelToken: string
  isChannelEnded: boolean
  managedJoinRequests: ManagedJoinRequest[]
  sendApproval: (request: ManagedJoinRequest, isAuthenticated: boolean) => void
}

function JoinRequestManager({
  hostChannelToken,
  isChannelEnded,
  managedJoinRequests,
  sendApproval,
}: Props) {
  const { requestClosed, closeRequest, showStatus, writeStatusClass } =
    useJoinRequestManager(hostChannelToken, isChannelEnded)

  return (
    <div>
      <div className="flex justify-center">
        <h2 className="text-lg" data-lang="clients-list-title"></h2>
        <button
          id="close-request-button"
          className="rounded text-white px-2 text-sm mx-2 bg-blue-500 hover:bg-blue-700 disabled:opacity-50"
          data-lang="stop-visitors-requests"
          // TODO: change closeRequest implementation to websocket
          onClick={() => closeRequest()}
          disabled={requestClosed}
        ></button>
      </div>
      <div className="flex justify-center mx-5 mt-2">
        <p className="text-xs opacity-50 scc-tip">
          <span className="font-bold" data-lang="stop-visitors-requests"></span>
          <span data-lang="stop-visitors-requests-tip"></span>
        </p>
      </div>
      <div className="flex justify-center mt-5">
        <ul>
          {managedJoinRequests.map((request, index) => (
            <li
              key={index}
              className="border border-blue-300 rounded shadow py-1 px-2 mb-3"
            >
              <div className="grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="flex justify-center items-center order-last md:order-first">
                  <button
                    id={`accept-btn-${index}`}
                    className="btn btn-blue mr-2 focus:opacity-50 disabled:opacity-50"
                    onClick={() => sendApproval(request, true)}
                    disabled={request.isAuthenticated !== null}
                    data-lang="accept-button"
                  >
                    Accept
                  </button>
                  <button
                    id={`reject-button-${index}`}
                    className="btn btn-red focus:opacity-50 disabled:opacity-50"
                    onClick={() => sendApproval(request, false)}
                    disabled={request.isAuthenticated !== null}
                    data-lang="reject-button"
                  >
                    Reject
                  </button>
                </div>
                <div>
                  <p className="text-sm md:text-base">
                    <span data-lang="visitor-codename">Codename</span>
                    <span className="mr-2">:</span>
                    <span>{request.codename}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span data-lang="visitor-passphrase">Passphrase</span>
                    <span className="mr-2">:</span>
                    <span>{request.passphrase}</span>
                  </p>
                  <p className="text-sm md:text-base">
                    <span data-lang="visitor-status">Status</span>
                    <span className="mr-2">:</span>
                    <span className={writeStatusClass(request.isAuthenticated)}>
                      {showStatus(request.isAuthenticated)}
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default JoinRequestManager
