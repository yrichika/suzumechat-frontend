import ChatMessage from 'types/ChatMessage'

type ChatMessages = {
  messages: ChatMessage[]
  index: number
}

const maxChatMessages = 10

export default function chatMessages(set: any, get: any) {
  return {
    messages: new Array<ChatMessage>(),
    addMessage: (newChat: ChatMessage) => {
      // NOTICE: don't know why, but the backend sends two messages at once
      // this is to avoid adding the same messages to the store
      if (
        get().messages.some((message: ChatMessage) => message.id === newChat.id)
      ) {
        return
      }
      set((prev: ChatMessages) => {
        if (prev.messages.length >= maxChatMessages) {
          prev.messages.shift()
        }
        return { messages: [...prev.messages, newChat] }
      })
    },
    index: 1,
    getIndex: () => get().index,
    incrementIndex: () =>
      set((prev: ChatMessages) => ({ index: prev.index + 1 })),
    clear: () => set({ messages: new Array<ChatMessage>(), index: 1 }),
  }
}
