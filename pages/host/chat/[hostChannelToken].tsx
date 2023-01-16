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
    // FIXME: 最初にこのページに来た瞬間は、上の変数のどれかが無いので、一瞬ここが実行されてしまう
    //        そのため、個々の処理はリダイレクトさせるには、setTimeoutとか必要
    //        もしくはエラー表示でもいい。ただしエラー表示の場合は、一瞬表示されてしまう
    //        wait表示を用意して、10秒たっても何も起きなければtopにリダイレクトでもいいかもしれない
    // router.push('/')
    return <div>sorry</div>
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
