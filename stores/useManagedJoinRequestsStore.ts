import { persist } from 'zustand/middleware'
import create from 'zustand'
import ManagedJoinRequest from 'types/messages/ManagedJoinRequest'

type ManagedJoinRequests = {
  requests: ManagedJoinRequest[]
}
// this is used by hosts
const managedJoinRequests = (set: any, get: any) => ({
  requests: new Array<ManagedJoinRequest>(),
  add: (newRequest: ManagedJoinRequest) => {
    set((prev: ManagedJoinRequests) => {
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
  update: (updatingRequest: ManagedJoinRequest) => {
    set((prev: ManagedJoinRequests) => {
      const updated = prev.requests.find(
        request => request.visitorId === updatingRequest.visitorId
      )
      if (updated) {
        updated.isAuthenticated = updatingRequest.isAuthenticated
        return { requests: [...prev.requests] }
      }
    })
  },
  clear: () => set({ requests: new Array<ManagedJoinRequest>() }),
})

const store = persist(managedJoinRequests, {
  name: 'visitors-requests',
  getStorage: () => sessionStorage,
})
const useManagedJoinRequestsStore = create(store)

export default useManagedJoinRequestsStore
