import useGuestStore from '@stores/useGuestStore'
import { isAnyOfEmpty } from '@utils/Util'
import { useRouter } from 'next/router'

export default function useGuestChannel() {
  const router = useRouter()
  const guestChannelToken = router.query.guestChannelToken as string | undefined

  const channelName = useGuestStore(store => store.channelName)
  // const guestId = useGuestStore(store => store.guestId)
  const codename = useGuestStore(store => store.codename)
  const secretKey = useGuestStore(store => store.secretKey)

  function isPageNotReady(): boolean {
    return isAnyOfEmpty(channelName, codename, secretKey)
  }

  function endChannel() {
    // TODO:
  }

  return {
    channelName,
    guestChannelToken,
    codename,
    secretKey,
    isPageNotReady,
    endChannel,
  }
}