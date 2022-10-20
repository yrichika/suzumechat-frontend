import { useEffect, useState, useRef, KeyboardEvent } from 'react'
import useHostMessageHandler from '@hooks/useHostMessageHandler'
import JoinRequestsManager from './JoinRequestsManager'
import Chat from '@components/organisms/Chat'

import useChatColor from '@hooks/useChatColor'

interface Props {
  hostChannelToken: string
  codename: string
  secretKey: string
  isChannelEnded: boolean
}

// FIXME: change name to HostWebSocket
function HostChat({
  hostChannelToken,
  codename,
  secretKey,
  isChannelEnded,
}: Props) {
  const { color, nameTextColor } = useChatColor()
  const {
    chatMessages,
    managedJoinRequests,
    sendChatMessage,
    sendApproval,
    disconnect,
  } = useHostMessageHandler(hostChannelToken, codename, secretKey, color)

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
        <JoinRequestsManager
          hostChannelToken={hostChannelToken}
          isChannelEnded={isChannelEnded}
          managedJoinRequests={managedJoinRequests}
          sendApproval={sendApproval}
        />
      </div>
    </div>
  )
}

export default HostChat
