import endChannelService from '@services/endChannelService'
import useHostStore from '@stores/useHostStore'
import { isAnyOfEmpty } from '@utils/Util'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function useHostChannel() {
  const router = useRouter()

  const hostChannelToken = router.query.hostChannelToken as string | undefined

  const channelName = useHostStore(state => state.channelName)
  const joinChannelToken = useHostStore(state => state.joinChannelToken)
  const secretKey = useHostStore(state => state.secretKey)
  const clearHostChannel = useHostStore(state => state.clear)
  const publicKeyEncSecretKey = useHostStore(
    store => store.publicKeyEncKeyPair
  ).secretKey
  const [isChannelEnded, setIsChannelEnded] = useState(false)

  function endChannel() {
    setIsChannelEnded(true)
    // DEBUG: このAPIでsession.invalidate()を呼ぶが、その際にhostIdの削除によって
    //        正しくTerminateメッセージがguest側に届くか未確認
    endChannelService(hostChannelToken!)
      .then(response => {
        clearHostChannel()
        router.push('/channelEnded')
      })
      .catch(error => {
        clearHostChannel()
        router.push('/channelEnded')
      })
  }

  function isPageNotReady() {
    return isAnyOfEmpty(
      hostChannelToken,
      channelName,
      joinChannelToken,
      secretKey
    )
  }

  return {
    isPageNotReady,
    channelName,
    endChannel,
    hostChannelToken,
    secretKey,
    publicKeyEncSecretKey,
    isChannelEnded,
    joinChannelToken,
  }
}
