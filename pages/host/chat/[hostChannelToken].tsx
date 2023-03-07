import React from 'react'
import Private from '@components/common/templates/Private'
import { langMap } from '@lang/host/chat/langMap'
import { toggleVisibilityBySelector, copyToClipboard } from '@utils/Util'
import HostMessageHandler from '@components/host/organisms/HostMessageHandler'
import useHostChannel from '@hooks/host/pages/useHostChannel'

function HostChannel() {
  const absoluteUrl = process.env.NEXT_PUBLIC_FRONT_URL
  const joinRequestUrl = '/visitor/'
  const {
    isPageNotReady,
    channelName,
    endChannel,
    hostChannelToken,
    secretKey,
    publicKeyEncSecretKey,
    isChannelEnded,
    joinChannelToken,
  } = useHostChannel()

  if (isPageNotReady()) {
    return <div>Loading...</div>
  }

  if (false) {
    // TODO: another guard clause (But still not sure if this is necessary).
    // access backend and check if this hostChannelToken exists in db.
    // if not, redirect to 404 error page.
  }

  return (
    <>
      <Private langMap={langMap} channelName={channelName}>
        <div className="container mx-auto">
          <div className="flex justify-end">
            <button
              onClick={event => toggleVisibilityBySelector(event, '.sc-tip')}
            >
              <span
                className="rounded-full text-white bg-blue-500 p-1"
                data-lang="tip-label"
              ></span>
            </button>
          </div>
          <div className="flex justify-start">
            <div>
              <button
                type="button"
                className="rounded bg-pink-500 hover:bg-pink-700 text-white px-2"
                data-lang="logout-button"
                onClick={endChannel}
              ></button>
              <span
                className="sc-tip text-xs opacity-50 ml-2"
                data-lang="dont-forget"
              ></span>
            </div>
          </div>
        </div>
        <main className="container mx-auto">
          <h1 className="text-4xl m-3">{channelName}</h1>
          <div>
            <div>
              <span className="block mx-2" data-lang="join-request-url"></span>
              <div className="flex mt-4 mx-2">
                <button
                  className="py-1 px-2 rounded-l text-sm btn-blue"
                  onClick={() => copyToClipboard('joinRequestUrl')}
                >
                  copy
                </button>
                <input
                  type="text"
                  id="joinRequestUrl"
                  className="w-full text-gray-600 bg-gray-200 rounded-r px-3"
                  value={`${absoluteUrl}${joinRequestUrl}${joinChannelToken}`}
                  readOnly
                />
              </div>
            </div>
            <hr className="mt-5" />
            <HostMessageHandler
              hostChannelToken={hostChannelToken!}
              secretKey={secretKey}
              publicKeyEncSecretKey={publicKeyEncSecretKey}
              isChannelEnded={isChannelEnded}
            />
          </div>
        </main>
      </Private>
    </>
  )
}

export default HostChannel
