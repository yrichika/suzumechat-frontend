import endChatService from '@services/endChatService'
import useGuestStore from '@stores/useGuestStore'
import { isAnyOfEmpty } from '@utils/Util'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function useGuestChannel() {
  const router = useRouter()
  const guestChannelToken = router.query.guestChannelToken as string | undefined

  const channelName = useGuestStore(store => store.channelName)
  // const guestId = useGuestStore(store => store.guestId)
  const codename = useGuestStore(store => store.codename)
  const secretKey = useGuestStore(store => store.secretKey)
  const clearGuestStore = useGuestStore(store => store.clear)
  const [isChatEnded, setIsChatEnded] = useState(false)

  function isPageNotReady(): boolean {
    return isAnyOfEmpty(channelName, codename, secretKey)
  }

  function endChannel() {
    setIsChatEnded(true)
    endChatService(guestChannelToken!)
      .then(response => {
        clearGuestStore()
        router.push('/guest/ended')
      })
      .catch(error => {
        clearGuestStore()
        router.push('/guest/ended')
      })
  }

  return {
    channelName,
    guestChannelToken,
    codename,
    secretKey,
    isChatEnded,
    isPageNotReady,
    clearGuestStore,
    endChannel,
  }
}
