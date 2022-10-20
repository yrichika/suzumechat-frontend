import create from 'zustand'
import { persist } from 'zustand/middleware'

type Guest = {
  channelName: string
  guestId: string
  codename: string
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
  secretKey: '',
  setSecretKey: (secretKey: string) => set((state: Guest) => ({ secretKey })),
  clear: () => set({ visitorId: '', guestId: '', codename: '', secretKey: '' }),
})

const store = persist(guestStore, {
  name: 'guest-store',
  getStorage: () => sessionStorage,
})
const useGuestStore = create(store)

export default useGuestStore
