import { Client, IFrame, IMessage } from '@stomp/stompjs'
import { useEffect, useState } from 'react'
import { connect, isInactive } from './stomp/config'
import useManagedJoinRequestsStore from '@stores/useManagedJoinRequestsStore'
import useHostChatMessagesStore from '@stores/useHostChatMessagesStore'
import { useChatMessageHandler } from './messagehandlers/useChatMessageHandler'
import useHostReceiver from './receivers/useHostReceiver'
import useHostSender from './senders/useHostSender'
import useJoinRequestMessageHandler from './messagehandlers/useJoinRequestMessageHandler'
import ChatUserAppearance from 'types/ChatUserAppearance'

export default function useHostMessageHandler(
  hostChannelToken: string,
  codename: string,
  secretKey: string,
  color: string
) {
  // common
  const [stompClient] = useState<Client>(new Client())

  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/host/${hostChannelToken}`
  // FIXME: useHostReceiver の中に移す
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/host/${hostChannelToken}`

  const chatMessages = useHostChatMessagesStore(store => store.messages)
  const addChatMessage = useHostChatMessagesStore(store => store.addMessage)
  const clearChatMessages = useHostChatMessagesStore(store => store.clear)
  const chatMessageIndex = useHostChatMessagesStore(store => store.index)
  const incrementMessageIndex = useHostChatMessagesStore(
    store => store.incrementIndex
  )

  const managedJoinRequests = useManagedJoinRequestsStore(
    state => state.requests
  )
  const addJoinRequest = useManagedJoinRequestsStore(state => state.add)
  const updateJoinRequest = useManagedJoinRequestsStore(state => state.update)
  const clearJoinRequests = useManagedJoinRequestsStore(state => state.clear)

  const userAppearance: ChatUserAppearance = { codename, color }

  // handle chat
  const { sendChatMessage, receiveChatMessage } = useChatMessageHandler(
    stompClient,
    WS_SEND_URL,
    userAppearance,
    secretKey,
    addChatMessage,
    chatMessageIndex
  )

  // handle JoinRequest
  const { receiveJoinRequest, sendApproval } = useJoinRequestMessageHandler(
    stompClient,
    WS_SEND_URL,
    addJoinRequest,
    updateJoinRequest
  )

  const { onConnect } = useHostReceiver(
    WS_RECEIVE_URL,
    receiveChatMessage,
    receiveJoinRequest
  )
  const { sendTerminateMessage } = useHostSender(stompClient, WS_SEND_URL)

  function disconnect() {
    if (isInactive(stompClient)) {
      return new Promise(() => {})
    }
    sendTerminateMessage()
    clearChatMessages()
    clearJoinRequests()
    console.log('WebSocket disconnected')
    return stompClient?.deactivate()
  }

  useEffect(() => {
    connect(stompClient, onConnect)
  }, [])

  return {
    chatMessages,
    managedJoinRequests,
    sendChatMessage,
    sendApproval,
    disconnect,
  }
}
