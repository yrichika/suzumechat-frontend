import { Client } from '@stomp/stompjs'
import { htmlspecialchars, isEmpty } from '@utils/Util'
import ChatMessage from 'types/ChatMessage'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import { StoreApi, UseBoundStore } from 'zustand'
import { isInactive } from './config'
import CryptoJS from 'crypto-js'
import { useEffect } from 'react'

export function useChatMessageHandler(
  useStoreFunc: UseBoundStore<StoreApi<any>>,
  stompClient: Client | undefined,
  wsSendUrl: string,
  codename: string,
  secretKey: string,
  color: string
) {
  const chatMessages = useStoreFunc(store => store.messages)
  const addChatMessage = useStoreFunc(store => store.addMessage)
  const clearChatMessages = useStoreFunc(store => store.clear)
  const chatMessageIndex = useStoreFunc(store => store.index)
  const incrementMessageIndex = useStoreFunc(store => store.incrementIndex)

  function handleChatMessage(messageBody: any) {
    const chatMessage: ChatMessage = decrypt(messageBody)
    addChatMessage(chatMessage)
  }

  function sendChatMessage(messageInput: string) {
    if (isInactive(stompClient)) {
      return
    }

    console.log('sending message: [' + messageInput + ']')
    const encryptedMessage = encrypt(messageInput)
    const messageCapsule: ChatMessageCapsule = { encryptedMessage }
    stompClient?.publish({
      destination: wsSendUrl,
      body: JSON.stringify(messageCapsule),
    })
  }

  function encrypt(
    sendingMessage: string,
    timestamp: number = Date.now()
  ): string {
    const sanitizedMessage = htmlspecialchars(sendingMessage)
    const chatMessage: ChatMessage = {
      id: chatMessageIndex,
      name: codename,
      message: sanitizedMessage,
      color: color,
      timestamp: timestamp,
    }
    incrementMessageIndex()
    const jsonedMessage = JSON.stringify(chatMessage)
    return CryptoJS.AES.encrypt(jsonedMessage, secretKey).toString()
  }

  function decrypt(messageCapsule: ChatMessageCapsule): ChatMessage {
    // FIXME:
    // if (isEmpty(secretKey)) {
    //   console.log('secretKey is empty', secretKey)
    //   return {
    //     id: 99999,
    //     name: codename,
    //     message: 'error',
    //     color: color,
    //     timestamp: 99999999,
    //   } as ChatMessage
    // }

    const bytes = CryptoJS.AES.decrypt(
      messageCapsule.encryptedMessage,
      secretKey
    )
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decrypted)
  }

  return {
    chatMessages,
    sendChatMessage,
    handleChatMessage,
    clearChatMessages,
  }
}
