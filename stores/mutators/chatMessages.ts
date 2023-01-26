import ChatMessage from 'types/ChatMessage'

type ChatMessages = {
  messages: ChatMessage[]
  index: number
}

export const maxChatMessages = process.env.NEXT_PUBLIC_MAX_CHAT_MESSAGES
  ? +process.env.NEXT_PUBLIC_MAX_CHAT_MESSAGES // `+` to convert string to number
  : 10
const chatMessageTtl = process.env.NEXT_PUBLIC_CHAT_MESSAGE_TTL
  ? +process.env.NEXT_PUBLIC_CHAT_MESSAGE_TTL
  : 20000

export default function chatMessages(set: any, get: any) {
  return {
    messages: new Array<ChatMessage>(),
    addMessage: (newChat: ChatMessage) => {
      // NOTICE: don't know why, but the backend sends two messages at once
      // this is to avoid adding the same messages to the store
      if (
        get().messages.some(
          (message: ChatMessage) => message.timestamp === newChat.timestamp
        )
      ) {
        return
      }

      set((prev: ChatMessages) => {
        if (prev.messages.length >= maxChatMessages) {
          prev.messages.shift()
        }
        if (prev.messages.length > 0) {
          if (!prev.messages[0].timeMarkerToDelete) {
            prev.messages[0].timeMarkerToDelete = Date.now()
          }
        }
        get().incrementIndex()
        return { messages: [...prev.messages, newChat] }
      })
    },
    index: 1, // FIXME: not used?
    incrementIndex: () =>
      set((prev: ChatMessages) => ({ index: prev.index + 1 })),
    // TEST:
    shiftChatMessageIfOld: () => {
      if (get().messages.length <= 0) {
        return
      }
      const now = Date.now()
      if (!get().messages[0].timeMarkerToDelete) {
        get().messages[0].timeMarkerToDelete = now
        return
      }
      const timeMarkerToDelete = get().messages[0].timeMarkerToDelete
      if (now - chatMessageTtl < timeMarkerToDelete) {
        return
      }

      set((prev: ChatMessages) => {
        prev.messages.shift()
        if (prev.messages.length > 0) {
          prev.messages[0].timeMarkerToDelete = now
        }
        return { messages: [...prev.messages] }
      })
    },

    clear: () => set({ messages: new Array<ChatMessage>(), index: 1 }),
  }
}
