import React, { useEffect } from 'react'
import useGuestMessageHandler from '@hooks/pages/guest/useGuestMessageHandler'
import Chat from '@components/organisms/Chat'
import useChatColor from '@hooks/useChatColor'

interface Props {
  guestChannelToken: string
  codename: string
  secretKey: string
  isChatEnded: boolean
  clearGuestStore: () => void
}

function GuestChat({
  guestChannelToken,
  codename,
  secretKey,
  isChatEnded,
  clearGuestStore,
}: Props) {
  const { color, nameTextColor } = useChatColor()

  const { chatMessages, sendChatMessage, disconnect } = useGuestMessageHandler(
    guestChannelToken,
    codename,
    secretKey,
    color,
    clearGuestStore
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
