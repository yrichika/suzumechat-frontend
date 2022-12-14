import React from 'react'
import useGuestMessageHandler from '@hooks/pages/guest/useGuestMessageHandler'
import Chat from '@components/organisms/Chat'
import useChatColor from '@hooks/useChatColor'

interface Props {
  guestChannelToken: string
  codename: string
  secretKey: string
  clearGuestStore: () => void
}

function GuestChat({
  guestChannelToken,
  codename,
  secretKey,
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
