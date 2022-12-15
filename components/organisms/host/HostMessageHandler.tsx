import { useEffect, useState, useRef, KeyboardEvent } from 'react'
import useHostMessageHandler from '@hooks/pages/host/useHostMessageHandler'
import JoinRequestManager from './JoinRequestManager'
import Chat from '@components/organisms/Chat'

import useChatColor from '@hooks/useChatColor'

interface Props {
  hostChannelToken: string
  secretKey: string
  publicKeyEncSecretKey: Uint8Array
  isChannelEnded: boolean
}

function HostMessageHandler({
  hostChannelToken,
  secretKey,
  publicKeyEncSecretKey,
  isChannelEnded,
}: Props) {
  const codename = 'Host'
  const { color, nameTextColor } = useChatColor()
  const {
    chatMessages,
    manageableJoinRequests,
    sendChatMessage,
    sendApproval,
    sendCloseJoinRequest,
    disableSendingManageableJoinRequest,
    disconnect,
  } = useHostMessageHandler(
    hostChannelToken,
    codename,
    secretKey,
    publicKeyEncSecretKey,
    color
  )

  useEffect(() => {
    if (isChannelEnded) {
      disconnect()
    }
  }, [isChannelEnded])

  return (
    <div>
      <div className="mt-5 mb-5">
        <Chat
          codename={codename}
          chatMessages={chatMessages}
          nameTextColor={nameTextColor}
          color={color}
          sendChatMessage={sendChatMessage}
        />
      </div>
      <div className="mt-5">
        <JoinRequestManager
          hostChannelToken={hostChannelToken}
          isChannelEnded={isChannelEnded}
          manageableJoinRequests={manageableJoinRequests}
          sendApproval={sendApproval}
          sendCloseJoinRequest={sendCloseJoinRequest}
          disableSendingManageableJoinRequest={
            disableSendingManageableJoinRequest
          }
        />
      </div>
    </div>
  )
}

export default HostMessageHandler
