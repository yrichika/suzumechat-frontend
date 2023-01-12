import { Client } from '@stomp/stompjs'
import create from 'zustand'

type VisitorGuestSharedStompClient = {
  stompClient: Client
}

const visitorGuestSharedStompClientStore = (set: any, get: any) => ({
  stompClient: new Client(),
})

const useVisitorGuestSharedStompClientStore = create(
  visitorGuestSharedStompClientStore
)

export default useVisitorGuestSharedStompClientStore
