import chatMessages from './mutators/chatMessages'
import create from 'zustand'

const useGuestChatMessagesStore = create(chatMessages)

export default useGuestChatMessagesStore
