import endChatService from '@services/guest/endChatService'
import useGuestStore from '@stores/guest/useGuestStore'
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
  const [isChatEnded, setIsChatEnded] = useState(false)

  function isPageNotReady(): boolean {
    return isAnyOfEmpty(channelName, codename, secretKey)
  }

  function endChannel() {
    setIsChatEnded(true)
    endChatService(guestChannelToken!)
      .then(response => {
        sessionStorage.clear()
        router.push('/guest/ended')
      })
      .catch(error => {
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
    isPageNotReady,
    endChannel,
  }
}
