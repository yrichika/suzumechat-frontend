import useHostStore from '@stores/useHostStore'
import React, { useEffect, useState } from 'react'
import Private from '@components/templates/Private'
import { langMap } from '@lang/host/langMap'
import {
  toggleVisibilityBySelector,
  copyToClipboard,
  isAnyOfEmpty,
} from '@utils/Util'
import Chat from '@components/organisms/Chat'
import VisitorsRequestsManager from '@components/organisms/VisitorsRequestsManager'
import { randomInt } from '@utils/UnsafeRandom'
import { useRouter } from 'next/router'
import useVisitorsRequestsSseStatus from '@stores/useVisitorsRequestsSseStatus'
import endChannelService from '@services/endChannelService'

// TODO: このページの表示は、backendからホストのセッションもしくはトークンがないと表示されないように
// 制御させること
function HostChannel() {
  const router = useRouter()

  const hostChannelToken = router.query.hostChannelToken as string | undefined
  const webSocketUrl = `/host/${hostChannelToken}`
  // these are constant values, not reactive
  const channelName = useHostStore.getState().channelName ?? null
  const joinChannelToken = useHostStore.getState().joinChannelToken ?? null
  const secretKey = useHostStore.getState().secretKey ?? null
  const [isChannelEnded, setIsChannelEnded] = useState(false)

  const absoluteUrl = process.env.NEXT_PUBLIC_FRONT_URL
  const visitorsRequestUrl = '/visitor/'

  const endChannel = () => {
    setIsChannelEnded(true)
    endChannelService(hostChannelToken!)
      .then(response => {
        useHostStore.getState().clear()
        // TODO: cookie削除
        // router.push('/channelEnded')
      })
      .catch(error => {
        useHostStore.getState().clear()
        // TODO: cookie削除
        // router.push('/channelEnded')
      })
  }

  if (
    isAnyOfEmpty(hostChannelToken, channelName, joinChannelToken, secretKey)
  ) {
    // router.push('/') でもいいかも
    return <div>TODO: sor</div>
  }

  if (false) {
    // TODO: 別のガード節
    // バックエンドにアクセスして、このhostChannelTokenがDB存在するか確認
    // 存在しなければ、エラーページにリダイレクト
  }

  return (
    <>
      <Private langMap={langMap} channelName={channelName}>
        <div className="container mx-auto">
          <div className="flex justify-end">
            <button
              onClick={event => toggleVisibilityBySelector(event, '.scc-tip')}
            ></button>
            <span
              className="rounded-full text-white bg-blue-500 p-1"
              data-lang="tip-label"
            ></span>
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
                className="scc-tip text-xs opacity-50"
                data-lang="dont-forget"
              ></span>
            </div>
          </div>
        </div>
        <main className="container mx-auto">
          <h1 className="text-4xl m-3">{channelName}</h1>
          <div>
            <div>
              <span className="block mx-2" data-lang="guest-request-url"></span>
              <div className="flex mt-4 mx-2">
                <button
                  className="py-1 px-2 rounded-l text-sm btn-blue"
                  onClick={() => copyToClipboard('guest-request-url')}
                >
                  copy
                </button>
                <input
                  type="text"
                  id="guest-request-url"
                  className="w-full text-gray-600 bg-gray-200 rounded-r px-3"
                  value={`${absoluteUrl}${visitorsRequestUrl}${joinChannelToken}`}
                  readOnly
                />
              </div>
            </div>
            <hr className="mt-5" />
            <div className="mt-5 mb-5">
              <Chat
                webSocketUrl={webSocketUrl}
                codename="Host"
                secretKey={secretKey}
                isChannelEnded={isChannelEnded}
              />
            </div>
            <hr />
            <div className="mt-5">
              <VisitorsRequestsManager
                hostChannelToken={hostChannelToken!}
                isChannelEnded={isChannelEnded}
              />
            </div>
          </div>
        </main>
      </Private>
    </>
  )
}

export default HostChannel
