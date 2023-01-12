import { persist } from 'zustand/middleware'
import create from 'zustand'

import chatMessages from '../mutators/chatMessages'

const store = persist(chatMessages, {
  name: 'host-chat-messages',
  getStorage: () => sessionStorage,
})
const useHostChatMessagesStore = create(store)

export default useHostChatMessagesStore
