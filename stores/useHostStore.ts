import create from 'zustand'
import { persist } from 'zustand/middleware'

const hostStore = (set: any, get: any) => ({
  channelName: '',
  getChannelName: () => get().channelName,
  setChannelName: (channelName: string) =>
    set(state => ({ channelName: channelName })),

  secretKey: '',
  setSecretKey: (secretKey: string) => set(state => ({ secretKey: secretKey })),

  loginChannelToken: '',
  setLoginChannelToken: (loginChannelToken: string) =>
    set(state => ({ loginChannelToken: loginChannelToken })),
})

const store = persist(hostStore, {
  name: 'host-store',
  getStorage: () => sessionStorage,
})
const useHostStore = create(store)

export default useHostStore
