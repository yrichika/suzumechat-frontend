import { Client, IFrame, IMessage } from '@stomp/stompjs'
import { useEffect, useState } from 'react'
import { connect, isInactive } from '../../stomp/config'
import useManageableJoinRequestsStore from '@stores/useManageableJoinRequestsStore'
import useHostChatMessagesStore from '@stores/useHostChatMessagesStore'
import { useChatMessageHandler } from '../../messagehandlers/useChatMessageHandler'
import useHostReceiver from '../../receivers/useHostReceiver'
import useHostSender from '../../senders/useHostSender'
import useJoinRequestMessageHandler from '../../messagehandlers/useJoinRequestMessageHandler'
import ChatUserAppearance from 'types/ChatUserAppearance'

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
    disconnect,
  }
}
