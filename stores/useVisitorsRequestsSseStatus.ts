import create from 'zustand'
import { persist } from 'zustand/middleware'

type Status = {
  isClosed: boolean
}

// Once you closed guests' requests (meaning if you deleted secret key on the server)
// You can't invite any more guests to the chat channel.
// That's why this is a global state. You can't start new SSE session by reloading the page.
const visitorsRequestsSseStatus = (set: any, get: any) => ({
  isClosed: false,
  getIsClosed: () => get().isClosed,
  setIsClosed: (isClosed: boolean) =>
    set((state: Status) => ({ isClosed: isClosed })),
})

const store = persist(visitorsRequestsSseStatus, {
  name: 'visitors-requests-sse-status',
  getStorage: () => sessionStorage,
})
const useVisitorsRequestsSseStatus = create(store)

export default useVisitorsRequestsSseStatus
