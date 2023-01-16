import VisitorsJoinRequest from '@components/visitor/organisms/VisitorsJoinRequest'
import Restricted from '@components/common/templates/Restricted'
import { langMap } from '@lang/visitor/langMap'
import csrfTokenService from '@services/csrfTokenService'
import getChannelStatusByJoinTokenService from '@services/visitor/getChannelStatusByJoinTokenService'
import { useEffect } from 'react'

// originally client/request/view
export async function getServerSideProps(context: any) {
  const { joinChannelToken } = context.query
  if (!joinChannelToken) {
    return {
      props: {
        joinChannelToken: null,
        channelName: null,
        hostPublicKey: null,
        isAccepting: false,
      },
    }
  }

  const channelStatus = await getChannelStatusByJoinTokenService(
    joinChannelToken
  )

  return {
    props: {
      joinChannelToken,
      channelName: channelStatus?.channelName,
      hostPublicKey: channelStatus?.hostPublicKey,
      isAccepting: channelStatus?.isAccepting,
    },
  }
}

interface Prop {
  joinChannelToken: string
  channelName: string | null
  hostPublicKey: string | null
  isAccepting: boolean
}

function Visitor({
  joinChannelToken,
  channelName,
  hostPublicKey,
  isAccepting,
}: Prop) {
  useEffect(() => {
    sessionStorage.clear()

    csrfTokenService() // DELETE: necessary?
  }, [])

  if (false) {
    // TODO: もしguestとしてすでに認証されていれば、ここは表示させないようにする
  }
  if (!isAccepting || !hostPublicKey) {
    // TODO: チャンネルの受付が終わっていることの表示をするコンポーネントにする
    return <div>Sorry, this channel is closed.</div>
  }

  if (!channelName) {
    // TODO: ちゃんとしたエラーメッセージにする。エラー用のコンポーネント(もしくはページ)を作って、それを表示させる
    // なので、コンポーネントを返すか、ページへのリダイレクト処理を入れる
    return <div>Sorry, unexpected error</div>
  }

  return (
    <Restricted langMap={langMap}>
      <main className="container mx-auto">
        <div className="mx-2" data-lang="try-joining-to"></div>
        <h1 className="text-4xl m-3">{channelName}</h1>
        <VisitorsJoinRequest
          joinChannelToken={joinChannelToken}
          hostPublicKey={hostPublicKey}
          langMap={langMap}
        />
      </main>
    </Restricted>
  )
}

export default Visitor
