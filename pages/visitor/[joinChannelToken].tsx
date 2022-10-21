import Restricted from '@components/templates/Restricted'
import React, { useEffect } from 'react'
import { langMap } from '@lang/visitor/langMap'
import VisitorsJoinRequest from '@components/organisms/visitor/VisitorsJoinRequest'
import { useRouter } from 'next/router'
import getChannelNameByJoinTokenService from '@services/getChannelNameByJoinTokenService'
import csrfTokenService from '@services/csrfTokenService'

// originally client/request/view
export async function getServerSideProps(context: any) {
  const { joinChannelToken } = context.query
  if (!joinChannelToken) {
    return {
      props: { channelName: null, joinChannelToken: null, isAccepting: false },
    }
  }

  const channelStatus = await getChannelNameByJoinTokenService(joinChannelToken)

  return {
    props: {
      channelName: channelStatus?.channelName,
      joinChannelToken,
      isAccepting: channelStatus?.isAccepting,
    },
  }
}

interface Prop {
  channelName: string | null
  joinChannelToken: string
  isAccepting: boolean
}

function Visitor({ channelName, joinChannelToken, isAccepting }: Prop) {
  useEffect(() => {
    csrfTokenService() // DELETE: necessary?
  }, [])

  if (false) {
    // TODO: もしguestとしてすでに認証されていれば、ここは表示させないようにする
  }
  if (!isAccepting) {
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
          langMap={langMap}
          joinChannelToken={joinChannelToken}
        />
      </main>
    </Restricted>
  )
}

export default Visitor
