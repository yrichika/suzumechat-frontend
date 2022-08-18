import create from 'zustand'
import { persist } from 'zustand/middleware'

type Host = {
  channelName: string
  secretKey: string
  loginChannelToken: string
}

const hostStore = (set: any, get: any) => ({
  channelName: '',
  getChannelName: () => get().channelName,
  setChannelName: (channelName: string) =>
    set((state: Host) => ({ channelName: channelName })),

  secretKey: '',
  setSecretKey: (secretKey: string) =>
    set((state: Host) => ({ secretKey: secretKey })),

  loginChannelToken: '',
  setLoginChannelToken: (loginChannelToken: string) =>
    set((state: Host) => ({ loginChannelToken: loginChannelToken })),
})

const store = persist(hostStore, {
  name: 'host-store',
  getStorage: () => sessionStorage,
})
const useHostStore = create(store)

export default useHostStore
