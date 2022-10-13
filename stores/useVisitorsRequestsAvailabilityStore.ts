import create from 'zustand'
import { persist } from 'zustand/middleware'

type Status = {
  isClosed: boolean
}

// Once you closed guests' requests (meaning if you deleted secret key on the server)
// You can't invite any more guests to the chat channel.
// That's why this is a global state. You can't start new SSE session by reloading the page.
const visitorsRequestsAvailability = (set: any, get: any) => ({
  isClosed: false,
  setIsClosed: (isClosed: boolean) => set((status: Status) => ({ isClosed })),
  reset: () => set({ isClosed: false }),
})

const store = persist(visitorsRequestsAvailability, {
  name: 'visitors-requests-availability',
  getStorage: () => sessionStorage,
})
const useVisitorsRequestsAvailabilityStore = create(store)

export default useVisitorsRequestsAvailabilityStore
