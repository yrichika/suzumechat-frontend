import closeVisitorsRequests from '@services/closeVisitorsRequests'
import manageVisitorsRequest from '@services/manageVisitorsRqeust'
import useVisitorsRequestsSseStatus from '@stores/useVisitorsRequestsSseStatus'
import React, { useState, useEffect } from 'react'
import VisitorsAuthStatus from 'types/VisitorsAuthStatus'
import VisitorsRequest from 'types/VisitorsRequest'

interface Props {
  hostChannelToken: string
}

// originally ManageClientRequest
function VisitorsRequestsManager({ hostChannelToken }: Props) {
  const [requests, setRequests] = useState<Array<VisitorsRequest>>([])

  const requestClosed = useVisitorsRequestsSseStatus.getState().isClosed
  const setRequestClosed = useVisitorsRequestsSseStatus(
    state => state.setIsClosed
  )

  const [listening, setListening] = useState(false)
  const [eventSource, setEventSource] = useState<EventSource>()

  useEffect(() => {
    if (!listening) {
      const eventSourceInit = new EventSource(
        `${process.env.NEXT_PUBLIC_BACK_URL}/host/requestStatus/${hostChannelToken}`
      )

      eventSourceInit.onopen = () => {
        console.log('connection established')
      }

      eventSourceInit.onmessage = event => {
        console.log('message: ' + event.data)
        setRequests(JSON.parse(event.data))
      }

      eventSourceInit.onerror = event => {
        console.warn('there was an error with sse: ' + event)
        eventSourceInit.close()
      }
      setEventSource(eventSourceInit)
      setListening(true)

      // end hook
      return () => {
        if (eventSource) {
          eventSource.close()
          setListening(false)
        }
      }
    }
  }, [])

  function closeRequest() {
    if (listening) {
      closeVisitorsRequests(hostChannelToken)
        .then(data => {
          eventSource?.close()
          setListening(false)
          setRequestClosed(true)
        })
        .catch(error => {
          alert('TODO: メッセージをちゃんとする(マルチリンガル)')
        })
    }
  }

  function accept(request: VisitorsRequest, index: number) {
    // TODO:
    const auth: VisitorsAuthStatus = {
      visitorId: request.visitorId,
      isAuthenticated: true,
    }
    manageVisitorsRequest(hostChannelToken, auth).catch(error => {
      alert(request.codename + 'TODO: メッセージをちゃんとする(マルチリンガル)')
    })
  }

  function reject(request: VisitorsRequest, index: number) {
    // TODO:
    const auth: VisitorsAuthStatus = {
      visitorId: request.visitorId,
      isAuthenticated: false,
    }
    manageVisitorsRequest(hostChannelToken, auth).catch(error => {
      alert(request.codename + 'TODO: メッセージをちゃんとする(マルチリンガル)')
    })
  }

  function showStatus(isAuthenticated: null | boolean): string {
    if (isAuthenticated === null) {
      return 'Not Accepted'
    } else if (isAuthenticated === false) {
      return 'Rejected'
    }
    return 'Accepted'
  }

  function writeStatusClass(isAuthenticated: null | boolean): string {
    const baseStyle = 'text-sm px-1 border text-white rounded-full '
    const acceptedStyle = 'border-green-500 bg-green-500 '
    const rejectedStyle = 'border-red-500 bg-red-500 '
    return isAuthenticated
      ? baseStyle + acceptedStyle
      : baseStyle + rejectedStyle
  }

  return (
    <div>
      <div className="flex justify-center">
        <h2 className="text-lg" data-lang="clients-list-title"></h2>
        <button
          id="close-request-button"
          className="rounded text-white px-2 text-sm mx-2 bg-blue-500 hover:bg-blue-700 disabled:opacity-50"
          data-lang="stop-visitors-requests"
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
          {requests.map((request, index) => (
            <li
              key={index}
              className="border border-blue-300 rounded shadow py-1 px-2 mb-3"
            >
              <div className="grid grid-rows-2 md:grid-rows-1 grid-cols-1 md:grid-cols-2 md:gap-4">
                <div className="flex justify-center items-center order-last md:order-first">
                  <button
                    id={`accept-btn-${index}`}
                    className="btn btn-blue mr-2 focus:opacity-50 disabled:opacity-50"
                    onClick={() => accept(request, index)}
                    disabled={request.isAuthenticated !== null}
                    data-lang="accept-button"
                  >
                    Accept
                  </button>
                  <button
                    id={`reject-button-${index}`}
                    className="btn btn-red focus:opacity-50 disabled:opacity-50"
                    onClick={() => reject(request, index)}
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

export default VisitorsRequestsManager
