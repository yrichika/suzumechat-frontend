import useHostStore from '@stores/useHostStore'
import React, { useEffect } from 'react'
import Private from '@components/templates/Private'
import { langMap } from '@lang/host/langMap'
import { toggleVisibilityBySelector, copyToClipboard } from '@utils/Util'
import Chat from '@components/organisms/Chat'
import VisitorsRequestsManager from '@components/organisms/VisitorsRequestsManager'
import { randomInt } from '@utils/UnsafeRandom'
import { useRouter } from 'next/router'
import useVisitorsRequestsSseStatus from '@stores/useVisitorsRequestsSseStatus'

// TODO: このページの表示は、backendからホストのセッションもしくはトークンがないと表示されないように
// 制御させること
function HostChannel() {
  const router = useRouter()

  const hostChannelToken = router.query.hostChannelToken as string | undefined
  const webSocketUrl = `/host/${hostChannelToken}`
  // these are constant values, not reactive // DELETE: 後で??のは削除すること
  const channelName = useHostStore.getState().channelName ?? 'fake channel name'
  const joinChannelToken =
    useHostStore.getState().joinChannelToken ?? 'fake token'
  const secretKey = useHostStore.getState().secretKey ?? 'fake secret key'

  // TODO: envから取得する。http/httpsから必要
  const absoluteUrl = 'http://localhost:3000'
  const visitorsRequestUrl = '/visitor/'
  const colorIndex = randomInt(0, 34)

  // TODO: logout functionality
  const clearChannel = () => {}

  if (!hostChannelToken) {
    // TODO: ちゃんとしたエラーメッセージにする。エラー用のコンポーネント(もしくはページ)を作って、それを表示させる
    // なので、コンポーネントを返すか、ページへのリダイレクト処理を入れる
    return <div>Sorry, unexpected error</div>
  }

  if (false) {
    // TODO: 別のガード節
    // バックエンドにアクセスして、このhostChannelTokenがDB存在するか確認
    // 存在しなければ、エラーページにリダイレクト
    // channelName
    // joinChannelToken
    // secretKey
    // がなくてもエラーページ
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
            <form action="#">
              <button
                type="submit"
                className="rounded bg-pink-500 hover:bg-pink-700 text-white px-2"
                data-lang="logout-button"
                onClick={clearChannel}
              ></button>
              <span
                className="scc-tip text-xs opacity-50"
                data-lang="dont-forget"
              ></span>
            </form>
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
              {/* TODO: chat側のVue
              パラメータ:
              web-socket-url="@webSocketUrl"
              secret-key="@secretKey"
              codename="Host" :color-index="@Random.nextInt(34)"
              is-host*/}
              <Chat
                webSocketUrl={webSocketUrl}
                codename="Host"
                secretKey={secretKey}
              />
            </div>
            <hr />
            <div className="mt-5">
              <VisitorsRequestsManager hostChannelToken={hostChannelToken} />
            </div>
          </div>
        </main>
      </Private>
    </>
  )
}

export default HostChannel
