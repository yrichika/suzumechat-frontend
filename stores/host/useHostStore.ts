import { generateKeyPair } from '@hooks/utils/PublicKeyEncryption'
import { BoxKeyPair } from 'tweetnacl'
import create from 'zustand'
import { persist } from 'zustand/middleware'

type Host = {
  channelName: string
  publicKeyEncKeyPair: BoxKeyPair
  secretKey: string
  joinChannelToken: string
}

const hostStore = (set: any, get: any) => ({
  channelName: '',
  setChannelName: (channelName: string) =>
    set((state: Host) => ({ channelName: channelName })),

  publicKeyEncKeyPair: {
    publicKey: new Uint8Array(),
    secretKey: new Uint8Array(),
  },
  initPublicKeyEncKeyPair: () =>
    set((state: Host) => ({ publicKeyEncKeyPair: generateKeyPair() })),

  secretKey: '',
  setSecretKey: (secretKey: string) =>
    set((state: Host) => ({ secretKey: secretKey })),

  joinChannelToken: '',
  setJoinChannelToken: (joinChannelToken: string) =>
    set((state: Host) => ({ joinChannelToken: joinChannelToken })),

  clear: () =>
    set({
      channelName: '',
      publicKeyEncKeyPair: {
        publicKey: new Uint8Array(),
        secretKey: new Uint8Array(),
      },
      secretKey: '',
      joinChannelToken: '',
    }),
})

const store = persist(hostStore, {
  name: 'host-store',
  getStorage: () => sessionStorage,
})
const useHostStore = create(store)

export default useHostStore
