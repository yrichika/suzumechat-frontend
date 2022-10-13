import Private from '@components/templates/Private'
import React, { useEffect } from 'react'
import { langMap } from '@lang/guest/langMap'
import { toggleVisibilityBySelector } from '@utils/Util'
import { randomInt } from '@utils/UnsafeRandom'
import useGuestStore from '@stores/useGuestStore'
import getGuestService from '@services/getGuestService'
import getGuestChannelByGuestTokenService from '@services/getGuestChannelByGuestTokenService'

export async function getServerSideProps(context: any) {
  const { guestChannelToken } = context.query
  if (!guestChannelToken) {
    return { props: { channelName: null } }
  }

  const guestChannel = await getGuestChannelByGuestTokenService(
    guestChannelToken
  )
  if (!guestChannel) {
    return { props: { channelName: null } }
  }
  return {
    props: { channelName: guestChannel.channelName },
  }
}

interface Prop {
  channelName: string | null
}

function GuestChannel({ channelName }: Prop) {
  // TODO: guestページでは、以下の情報がないとチャットがそもそもできないので
  //       useGuestStoreにvisitorの段階から入れる必要がある
  const guestId = useGuestStore(store => store.guestId)
  const codename = useGuestStore(store => store.codename)
  const setCodename = useGuestStore(store => store.setCodename)
  const secretKey = useGuestStore(store => store.secretKey)
  const setSecretKey = useGuestStore(store => store.setSecretKey)

  // useEffect(() => {
  //   // TODO: 1. ここでguestIdをサーバー側に問い合わせて、codename, secretKeyを取得する
  //   //       2. サーバー側で、guestIdをセッションに保存する
  //   getGuestService(guestId).then(response => {
  //     setCodename(response.data.codename)
  //     setSecretKey(response.data.secretKey)
  //   })
  // }, [])

  // TODO: 足りない情報があれば、即死
  if (!channelName) {
    return // TODO: sorryページ表示
  }

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
          {/* <Chat chatUrl={chatUrl} codename={codename} secretKey={secretKey} /> */}
        </div>
      </main>
    </Private>
  )
}

export default GuestChannel
