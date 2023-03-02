import endChatService from '@services/guest/endChatService'
import useGuestStore from '@stores/guest/useGuestStore'
import { isAnyOfEmpty } from '@utils/Util'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function useGuestChannel() {
  const router = useRouter()
  const guestChannelToken = router.query.guestChannelToken as string | undefined

  const channelName = useGuestStore(store => store.channelName)
  const guestId = useGuestStore(store => store.guestId)
  const codename = useGuestStore(store => store.codename)
  const secretKey = useGuestStore(store => store.secretKey)
  const clearGuestStore = useGuestStore(store => store.clear)
  const [isChatEnded, setIsChatEnded] = useState(false)

  function isPageNotReady(): boolean {
    return isAnyOfEmpty(guestId, channelName, codename, secretKey)
  }

  function endChannel() {
    setIsChatEnded(true)
    endChatService(guestChannelToken!)
      .then(response => {
        clearGuestStore()
        sessionStorage.clear()
        router.push('/guest/ended')
      })
      .catch(error => {
        clearGuestStore()
        sessionStorage.clear()
        router.push('/guest/ended')
      })
  }

  return {
    channelName,
    guestChannelToken,
    codename,
    secretKey,
    isChatEnded,
    clearGuestStore,
    isPageNotReady,
    endChannel,
  }
}
