import create from 'zustand'
import { persist } from 'zustand/middleware'

type Guest = {
  visitorId: string
  guestId: string
  codename: string
  secretKey: string
}

const guestStore = (set: any, get: any) => ({
  visitorId: '',
  setVisitorId: (visitorId: string) => set((state: Guest) => ({ visitorId })),
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
