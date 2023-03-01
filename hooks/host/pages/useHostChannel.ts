import endChannelService from '@services/host/endChannelService'
import useHostStore from '@stores/host/useHostStore'
import { isAnyOfEmpty } from '@utils/Util'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function useHostChannel() {
  const router = useRouter()

  const hostChannelToken = router.query.hostChannelToken as string | undefined

  const channelName = useHostStore(state => state.channelName)
  const joinChannelToken = useHostStore(state => state.joinChannelToken)
  const secretKey = useHostStore(state => state.secretKey)
  const publicKeyEncSecretKey = useHostStore(
    store => store.publicKeyEncKeyPair
  ).secretKey
  const clearHostStore = useHostStore(store => store.clear)
  const [isChannelEnded, setIsChannelEnded] = useState(false)

  function endChannel() {
    setIsChannelEnded(true)
    endChannelService(hostChannelToken!)
      .then(response => {
        clearHostStore()
        sessionStorage.clear()
        router.push('/host/channelEnded')
      })
      .catch(error => {
        clearHostStore()
        sessionStorage.clear()
        router.push('/host/channelEnded')
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
