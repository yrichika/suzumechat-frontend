import React, { useEffect } from 'react'
import useGuestMessageHandler from '@hooks/guest/components/useGuestMessageHandler'
import Chat from '@components/common/organisms/Chat'
import useChatColor from '@hooks/common/components/useChatColor'

interface Props {
  guestChannelToken: string
  codename: string
  secretKey: string
  isChatEnded: boolean
}

function GuestChat({
  guestChannelToken,
  codename,
  secretKey,
  isChatEnded,
}: Props) {
  const { color, nameTextColor } = useChatColor()

  const { chatMessages, sendChatMessage, disconnect } = useGuestMessageHandler(
    guestChannelToken,
    codename,
    secretKey,
    color
  )

  useEffect(() => {
    if (isChatEnded) {
      disconnect()
    }
  }, [isChatEnded])

  return (
    <div>
      <Chat
        codename={codename}
        chatMessages={chatMessages}
        nameTextColor={nameTextColor}
        color={color}
        sendChatMessage={sendChatMessage}
      />
    </div>
  )
}

export default GuestChat
