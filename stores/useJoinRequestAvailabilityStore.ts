import create from 'zustand'
import { persist } from 'zustand/middleware'

type Status = {
  isClosed: boolean
}

// Once you closed guests' requests (meaning if you deleted secret key on the server)
// you can't invite any more guests to the chat channel.
// That's why this is a global state. You can't start new SSE session by reloading the page.
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
