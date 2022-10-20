import Private from '@components/templates/Private'
import React, { useEffect, useState } from 'react'
import { langMap } from '@lang/guest/langMap'
import { isAnyOfEmpty, toggleVisibilityBySelector } from '@utils/Util'
import useGuestStore from '@stores/useGuestStore'
import GuestChat from '@components/organisms/guest/GuestChat'
import { useRouter } from 'next/router'

function GuestChannel() {
  const router = useRouter()
  const guestChannelToken = router.query.guestChannelToken as string | undefined

  const channelName = useGuestStore(store => store.channelName)
  const guestId = useGuestStore(store => store.guestId)
  const codename = useGuestStore(store => store.codename)
  const secretKey = useGuestStore(store => store.secretKey)

  function endChannel() {
    // TODO:
  }

  // FIXME: does not work here!: Error: "Hydration failed because the initial UI does not match what was rendered on the server"
  // if (isAnyOfEmpty(channelName, codename, secretKey)) {
  //   return <div>sorry</div> // TODO: sorryページ表示
  // }

  return (
    <>
      <Private langMap={langMap} channelName={channelName}>
        <div className="container mx-auto">
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
            />
          </div>
        </main>
      </Private>
    </>
  )
}

export default GuestChannel
