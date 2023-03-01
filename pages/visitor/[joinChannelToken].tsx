import VisitorsJoinRequest from '@components/visitor/organisms/VisitorsJoinRequest'
import Restricted from '@components/common/templates/Restricted'
import { langMap } from '@lang/visitor/langMap'
import getChannelStatusByJoinTokenService from '@services/visitor/getChannelStatusByJoinTokenService'
import { useEffect } from 'react'
import { decode as decodeBase64 } from '@stablelib/base64'
import useVisitor from '@hooks/visitor/pages/useVisitor'

// originally client/request/view
export async function getServerSideProps(context: any) {
  const { joinChannelToken } = context.query
  if (!joinChannelToken) {
    return { notFound: true }
  }

  const channelStatus = await getChannelStatusByJoinTokenService(
    joinChannelToken
  )

  if (!channelStatus) {
    return { notFound: true }
  }

  return {
    props: {
      joinChannelToken,
      channelName: channelStatus.channelName,
      hostPublicKey: channelStatus.hostPublicKey,
      isAccepting: channelStatus.isAccepting,
    },
  }
}

interface Prop {
  joinChannelToken: string
  channelName: string
  hostPublicKey: string | null
  isAccepting: boolean
}

function Visitor({
  joinChannelToken,
  channelName,
  hostPublicKey,
  isAccepting,
}: Prop) {
  const {
    guestId,
    initPublicKeyEncKeyPair,
    setHostPublicKey,
    clearGuestStore,
  } = useVisitor()

  useEffect(() => {
    clearGuestStore()
    sessionStorage.clear()

    if (isAccepting && hostPublicKey) {
      initPublicKeyEncKeyPair()
      const hostPublicKeyUnit8Array = decodeBase64(hostPublicKey!)
      setHostPublicKey(hostPublicKeyUnit8Array)
    }
  }, [])

  if (false) {
    // TODO: if approved as a guest, this page should not be displayed? should redirect to the guest chat page?
    return <div>already approved as a guest</div>
  }

  if (!isAccepting || !hostPublicKey) {
    return (
      <Restricted langMap={langMap}>
        <div className="h-96">
          <p className="text-center">
            <span data-lang="channel-closed"></span>
          </p>
        </div>
      </Restricted>
    )
  }

  if (!channelName) {
    return (
      <Restricted langMap={langMap}>
        <div className="h-96">
          {/* TODO: redirect to error page */}
          <p>Sorry, unexpected error</p>
        </div>
      </Restricted>
    )
  }

  return (
    <Restricted langMap={langMap}>
      <main className="container mx-auto">
        <div className="mx-2" data-lang="try-joining-to"></div>
        <h1 className="text-4xl m-3">{channelName}</h1>
        <VisitorsJoinRequest
          joinChannelToken={joinChannelToken}
          guestId={guestId}
          langMap={langMap}
        />
      </main>
    </Restricted>
  )
}

export default Visitor
