import Private from '@components/templates/Private'
import React, { useEffect } from 'react'
import { langMap } from '@lang/guest/langMap'
import { toggleVisibilityBySelector } from '@utils/Util'
import useGuestStore from '@stores/useGuestStore'
import getGuestService from '@services/getGuestService'
import getGuestChannelByGuestTokenService from '@services/getGuestChannelByGuestTokenService'
import GuestChat from '@components/organisms/guest/GuestChat'

export async function getServerSideProps(context: any) {
  const { guestChannelToken } = context.query
  if (!guestChannelToken) {
    return { props: { channelName: null, guestChannelToken } }
  }

  const guestChannel = await getGuestChannelByGuestTokenService(
    guestChannelToken
  )
  if (!guestChannel) {
    return { props: { channelName: null, guestChannelToken } }
  }
  return {
    props: { channelName: guestChannel.channelName, guestChannelToken },
  }
}

interface Prop {
  channelName: string | null
  guestChannelToken: string
}

function GuestChannel({ channelName, guestChannelToken }: Prop) {
  const guestId = useGuestStore(store => store.guestId)
  // FIXME: これらはvisitorの段階で取得したほうがいいか?
  const codename = useGuestStore(store => store.codename)
  const setCodename = useGuestStore(store => store.setCodename)
  const secretKey = useGuestStore(store => store.secretKey)
  const setSecretKey = useGuestStore(store => store.setSecretKey)

  useEffect(() => {
    getGuestService(guestId, guestChannelToken).then(guestDto => {
      if (!guestDto) {
        return // TODO: エラーページへリダイレクト
      }
      setCodename(guestDto.codename)
      setSecretKey(guestDto.secretKey)
    })
  }, [])

  function endChannel() {
    // TODO:
  }

  // TODO: 足りない情報があれば、即死
  if (!channelName) {
    return // TODO: sorryページ表示
  }

  return (
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
        <h1 className="text-4xl m-3">{channelName}</h1>
        <hr className="mx-2 my-4" />
        <div>
          <div>
            <span data-lang="how-to-end"></span>
          </div>
          <GuestChat
            guestChannelToken={guestChannelToken}
            codename={codename}
            secretKey={secretKey}
          />
        </div>
      </main>
    </Private>
  )
}

export default GuestChannel
