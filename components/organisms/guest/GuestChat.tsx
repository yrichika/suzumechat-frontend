import React, { useEffect, useState } from 'react'
import useGuestMessageHandler from '@hooks/useGuestMessageHandler'
import Chat from '@components/organisms/Chat'
import { isAnyOfEmpty } from '@utils/Util'
import useChatColor from '@hooks/useChatColor'

interface Props {
  guestChannelToken: string
  codename: string
  secretKey: string
}

function GuestChat({ guestChannelToken, codename, secretKey }: Props) {
  const { color, nameTextColor } = useChatColor()

  const { chatMessages, sendChatMessage, disconnect } = useGuestMessageHandler(
    guestChannelToken,
    codename,
    secretKey,
    color
  )

  // TODO:
  if (isAnyOfEmpty(guestChannelToken, codename, secretKey)) {
    return <div>please wait...</div>
  }

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
