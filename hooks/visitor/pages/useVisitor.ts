import useGuestStore from '@stores/guest/useGuestStore'
import { useEffect } from 'react'
import { decode as decodeBase64 } from '@stablelib/base64'

export default function useVisitor(
  hostPublicKeyString: string | null,
  isAccepting: boolean
) {
  const setChannelName = useGuestStore(store => store.setChannelName)
  const guestId = useGuestStore(state => state.guestId)
  const setGuestId = useGuestStore(state => state.setGuestId)
  const setCodename = useGuestStore(store => store.setCodename)
  const publicKeyEncKeyPair = useGuestStore(store => store.publicKeyEncKeyPair)
  const initPublicKeyEncKeyPair = useGuestStore(
    store => store.initPublicKeyEncKeyPair
  )
  const hostPublicKey = useGuestStore(store => store.hostPublicKey)
  const setHostPublicKey = useGuestStore(store => store.setHostPublicKey)
  const setSecretKey = useGuestStore(store => store.setSecretKey)
  const clearGuestStore = useGuestStore(state => state.clear)

  useEffect(() => {
    clearGuestStore()
    sessionStorage.clear()

    if (isAccepting && hostPublicKeyString) {
      initPublicKeyEncKeyPair()
      const hostPublicKeyUnit8Array = decodeBase64(hostPublicKeyString)
      setHostPublicKey(hostPublicKeyUnit8Array)
    }
  }, [])

  return {
    guestId,
    publicKeyEncKeyPair,
    hostPublicKey,
    setChannelName,
    setGuestId,
    setCodename,
    initPublicKeyEncKeyPair,
    setHostPublicKey,
    setSecretKey,
    clearGuestStore,
  }
}
