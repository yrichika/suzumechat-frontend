import { generateKeyPair } from '@hooks/utils/PublicKeyEncryption'
import { BoxKeyPair } from 'tweetnacl'
import create from 'zustand'
import { persist } from 'zustand/middleware'

type Guest = {
  channelName: string
  guestId: string
  codename: string
  publicKeyEncKeyPair: BoxKeyPair
  hostPublicKey: Uint8Array
  secretKey: string
}

const guestStore = (set: any, get: any) => ({
  channelName: '',
  setChannelName: (channelName: string) =>
    set((state: Guest) => ({ channelName })),

  guestId: '',
  setGuestId: (guestId: string) => set((state: Guest) => ({ guestId })),

  codename: '',
  setCodename: (codename: string) => set((state: Guest) => ({ codename })),

  publicKeyEncKeyPair: {
    publicKey: new Uint8Array(),
    secretKey: new Uint8Array(),
  },
  initPublicKeyEncKeyPair: () =>
    set((state: Guest) => ({ publicKeyEncKeyPair: generateKeyPair() })),

  hostPublicKey: new Uint8Array(),
  setHostPublicKey: (hostPublicKey: Uint8Array) =>
    set((state: Guest) => ({ hostPublicKey })),

  secretKey: '',
  setSecretKey: (secretKey: string) => set((state: Guest) => ({ secretKey })),
  clear: () =>
    set({
      channelName: '',
      guestId: '',
      codename: '',
      publicKeyEncKeyPair: {
        publicKey: new Uint8Array(),
        secretKey: new Uint8Array(),
      },
      hostPublicKey: new Uint8Array(),
      secretKey: '',
    }),
})

const store = persist(guestStore, {
  name: 'guest-store',
  getStorage: () => sessionStorage,
})
const useGuestStore = create(store)

export default useGuestStore
