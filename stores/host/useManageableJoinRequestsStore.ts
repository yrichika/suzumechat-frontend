import { persist } from 'zustand/middleware'
import create from 'zustand'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'

type ManageableJoinRequests = {
  requests: ManageableJoinRequest[]
}
// this is used by hosts
const manageableJoinRequests = (set: any, get: any) => ({
  requests: new Array<ManageableJoinRequest>(),
  add: (newRequest: ManageableJoinRequest) => {
    set((prev: ManageableJoinRequests) => {
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
  update: (updatingRequest: ManageableJoinRequest) => {
    set((prev: ManageableJoinRequests) => {
      const updated = prev.requests.find(
        request => request.visitorId === updatingRequest.visitorId
      )
      if (updated) {
        updated.isAuthenticated = updatingRequest.isAuthenticated
        updated.isSendable = false
        return { requests: [...prev.requests] }
      }
    })
  },
  disableSending: () => {
    set((prev: ManageableJoinRequests) => {
      const sendingDisabledRequests = prev.requests.map(request => {
        request.isSendable = false
        return request
      })
      return { requests: [...sendingDisabledRequests] }
    })
  },
  clear: () => set({ requests: new Array<ManageableJoinRequest>() }),
})

const store = persist(manageableJoinRequests, {
  name: 'visitors-requests',
  getStorage: () => sessionStorage,
})
const useManageableJoinRequestsStore = create(store)

export default useManageableJoinRequestsStore
