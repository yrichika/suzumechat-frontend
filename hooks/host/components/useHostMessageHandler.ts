import { Client } from '@stomp/stompjs'
import useHostChatMessagesStore from '@stores/host/useHostChatMessagesStore'
import useManageableJoinRequestsStore from '@stores/host/useManageableJoinRequestsStore'
import { useEffect, useState } from 'react'
import ChatUserAppearance from 'types/ChatUserAppearance'
import { useChatMessageHandler } from '../../common/messagehandlers/useChatMessageHandler'
import useJoinRequestMessageHandler from '../messagehandlers/useJoinRequestMessageHandler'
import useHostReceiver from '../messagehandlers/receivers/useHostReceiver'
import useHostSender from '../messagehandlers/senders/useHostSender'
import { connect } from '../../stomp/config'

export default function useHostMessageHandler(
  hostChannelToken: string,
  codename: string,
  secretKey: string,
  publicKeyEncSecretKey: Uint8Array,
  color: string
) {
  // common
  const [stompClient] = useState<Client>(new Client())

  const WS_SEND_URL = `${process.env.NEXT_PUBLIC_WS_SEND_PREFIX}/host/${hostChannelToken}`
  // FIXME: useHostReceiver の中に移す
  const WS_RECEIVE_URL = `${process.env.NEXT_PUBLIC_WS_BROADCASTED_PREFIX}/host/${hostChannelToken}`

  const chatMessages = useHostChatMessagesStore(store => store.messages)
  const addChatMessage = useHostChatMessagesStore(store => store.addMessage)
  const chatMessageIndex = useHostChatMessagesStore(store => store.index)

  const manageableJoinRequests = useManageableJoinRequestsStore(
    state => state.requests
  )
  const addManageableJoinRequest = useManageableJoinRequestsStore(
    state => state.add
  )
  const updateManageableJoinRequest = useManageableJoinRequestsStore(
    state => state.update
  )
  const disableSendingManageableJoinRequest = useManageableJoinRequestsStore(
    state => state.disableSending
  )

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
  const { receiveJoinRequest, sendApproval, sendCloseJoinRequest } =
    useJoinRequestMessageHandler(
      stompClient,
      WS_SEND_URL,
      publicKeyEncSecretKey,
      addManageableJoinRequest,
      updateManageableJoinRequest
    )

  const { onConnect } = useHostReceiver(
    WS_RECEIVE_URL,
    receiveChatMessage,
    receiveJoinRequest
  )
  const { sendTerminateMessage } = useHostSender(stompClient, WS_SEND_URL)

  function disconnect() {
    sendTerminateMessage()
    sessionStorage.clear()
    if (stompClient.active) {
      return stompClient.deactivate()
    }
    return new Promise(() => {})
  }

  useEffect(() => {
    connect(stompClient, onConnect)
  }, [])

  return {
    chatMessages,
    manageableJoinRequests,
    sendChatMessage,
    sendApproval,
    sendCloseJoinRequest,
    disableSendingManageableJoinRequest,
    disconnect,
  }
}
