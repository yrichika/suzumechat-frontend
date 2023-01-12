import create from 'zustand'
import { persist } from 'zustand/middleware'

type Status = {
  isClosed: boolean
}

const joinRequestAvailability = (set: any, get: any) => ({
  isClosed: false,
  setIsClosed: (isClosed: boolean) => set((status: Status) => ({ isClosed })),
  clear: () => set({ isClosed: false }),
})

const store = persist(joinRequestAvailability, {
  name: 'visitors-requests-availability',
  getStorage: () => sessionStorage,
})
const useJoinRequestAvailabilityStore = create(store)

export default useJoinRequestAvailabilityStore
