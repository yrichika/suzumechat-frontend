import { KeyboardEvent, useState } from 'react'

export default function useChat(
  sendChatMessage: (messageInput: string) => void
) {
  const [messageInput, setMessageInput] = useState('')

  function handleMessage() {
    if (messageInput === '') {
      return
    }
    // TODO: validation: less than 1000 letters
    sendChatMessage(messageInput)
    setMessageInput('')
  }

  function sendShortcut(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (event.shiftKey && event.key == 'Enter') {
      event.preventDefault() // prevents extra line break in textarea
      handleMessage()
    }
  }
  return {
    messageInput,
    setMessageInput,
    handleMessage,
    sendShortcut,
  }
}
