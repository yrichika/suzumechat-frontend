import Private from '@components/common/templates/Private'
import React from 'react'
import { langMap } from '@lang/guest/chat/langMap'
import { toggleVisibilityBySelector } from '@utils/Util'
import GuestChat from '@components/guest/organisms/GuestChat'
import useGuestChannel from '@hooks/guest/pages/useGuestChannel'

function GuestChannel() {
  const {
    channelName,
    guestChannelToken,
    codename,
    secretKey,
    isChatEnded,
    isPageNotReady,
    endChannel,
  } = useGuestChannel()

  // FIXME: does not work here!: Error: "Hydration failed because the initial UI does not match what was rendered on the server"
  // if (isPageNotReady()) {
  //   return <div>sorry</div> // TODO: sorryページ表示
  // }

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
            </div>
          </div>
        </div>

        <main className="container mx-auto">
          <h1 className="text-4xl m-3" suppressHydrationWarning={true}>
            {/* FIXME: hydration warning for this `channelName` */}
            {channelName}
          </h1>
          <hr className="mx-2 my-4" />
          <div>
            <div>
              <span data-lang="how-to-end"></span>
            </div>
            <GuestChat
              guestChannelToken={guestChannelToken!}
              codename={codename}
              secretKey={secretKey}
              isChatEnded={isChatEnded}
            />
          </div>
        </main>
      </Private>
    </>
  )
}

export default GuestChannel
