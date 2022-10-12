import { persist } from 'zustand/middleware'
import create from 'zustand'
import VisitorsRequest from 'types/messages/VisitorsRequest'

type VisitorsRequests = {
  requests: VisitorsRequest[]
}
// this is used by hosts
const visitorsRequests = (set: any, get: any) => ({
  requests: new Array<VisitorsRequest>(),
  get: () => get().requests,
  add: (newRequest: VisitorsRequest) => {
    set((prev: VisitorsRequests) => {
      // only accepts single visitorId per request
      const exists = prev.requests.some(
        request => request.visitorId === newRequest.visitorId
      )
      if (!exists) {
        return {
          requests: [...prev.requests, newRequest],
        }
      }
    })
  },
  update: (updatingRequest: VisitorsRequest) => {
    set((prev: VisitorsRequests) => {
      const updated = prev.requests.find(
        request => request.visitorId === updatingRequest.visitorId
      )
      if (updated) {
        updated.isAuthenticated = updatingRequest.isAuthenticated
        return { requests: [...prev.requests] }
      }
    })
  },
  clear: () => set({ requests: new Array<VisitorsRequest>() }),
})

const store = persist(visitorsRequests, {
  name: 'visitors-requests',
  getStorage: () => sessionStorage,
})
const useVisitorsRequestsStore = create(store)

export default useVisitorsRequestsStore
