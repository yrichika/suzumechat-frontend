import useGuestStore from '@stores/guest/useGuestStore'

export default function useVisitor() {
  const guestId = useGuestStore(state => state.guestId)
  const initPublicKeyEncKeyPair = useGuestStore(
    store => store.initPublicKeyEncKeyPair
  )
  const setHostPublicKey = useGuestStore(store => store.setHostPublicKey)
  const clearGuestStore = useGuestStore(state => state.clear)

  return {
    guestId,
    initPublicKeyEncKeyPair,
    setHostPublicKey,
    clearGuestStore,
  }
}
