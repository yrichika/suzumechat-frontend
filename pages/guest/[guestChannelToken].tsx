import Private from '@components/templates/Private'
import React from 'react'
import { langMap } from '@lang/guest/langMap'
import { toggleVisibilityBySelector } from '@utils/Util'
import Chat from '@components/organisms/Chat'
import { randomInt } from '@utils/UnsafeRandom'

function GuestChannel() {
  const channelName = 'fake channel' // TODO:
  const codename = 'guest'
  const webSocketUrl = ''
  const secretKey = ''

  return (
    <Private langMap={langMap} channelName={channelName}>
      <main className="container mx-auto">
        <div className="flex justify-end">
          <button
            onClick={event => toggleVisibilityBySelector(event, '.scc-tip')}
          >
            <span
              className="rounded-full text-white bg-blue-500 p-1"
              data-lang="tip-label"
            ></span>
          </button>
        </div>
        <h1 className="text-4xl m-3">{channelName}</h1>
        <hr className="mx-2 my-4" />
        <div>
          <div>
            <span data-lang="how-to-end"></span>
          </div>
          <Chat
            webSocketUrl={webSocketUrl}
            codename={codename}
            secretKey={secretKey}
          />
        </div>
      </main>
    </Private>
  )
}

export default GuestChannel
