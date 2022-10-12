import { persist } from 'zustand/middleware'
import create from 'zustand'
import ChatMessage from 'types/ChatMessage'

type ChatMessages = {
  messages: ChatMessage[]
  index: number
}

const chatMessages = (set: any, get: any) => ({
  messages: new Array<ChatMessage>(),
  getMessages: () => get().messages,
  addMessage: (newChat: ChatMessage) => {
    // TODO: shift message more than 10
    set((prev: ChatMessages) => ({ messages: [...prev.messages, newChat] }))
  },
  index: 1,
  getIndex: () => get().index,
  incrementIndex: () =>
    set((prev: ChatMessages) => ({ index: prev.index + 1 })),
  clear: () => set({ messages: new Array<ChatMessage>(), index: 1 }),
})

const store = persist(chatMessages, {
  name: 'chat-messages',
  getStorage: () => sessionStorage,
})
const useChatMessagesStore = create(store)

export default useChatMessagesStore
