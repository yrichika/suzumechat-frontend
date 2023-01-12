import useGuestChatMessagesStore from '@stores/guest/useGuestChatMessagesStore'
import { act, renderHook } from '@testing-library/react'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import { timeStamp } from 'console'
import ChatMessage from 'types/ChatMessage'
import { maxChatMessages } from '@stores/mutators/chatMessages'

describe('useGuestChatMessagesStore', () => {
  beforeEach(() => {
    //
  })

  test('incrementIndex should increment index', () => {
    const { result } = renderHook(() => useGuestChatMessagesStore())
    const incrementCount = randomInt(1, 5)
    act(() => {
      for (let i = 0; i < incrementCount; i++) {
        result.current.incrementIndex()
      }
    })
    expect(result.current.index).toBe(incrementCount + 1)
  })

  test('addMessage should add a message', () => {
    const { result } = renderHook(() => useGuestChatMessagesStore())
    const chatMessage = createChatMessage()
    act(() => {
      result.current.addMessage(chatMessage)
    })
    expect(result.current.messages).toEqual([chatMessage])

    // 2nd message
    const anotherMessage = createChatMessage()
    act(() => {
      result.current.addMessage(anotherMessage)
    })
    expect(result.current.messages).toEqual([chatMessage, anotherMessage])
  })

  test('addMessage should not add a message already stored with the same timestamp', () => {
    const { result } = renderHook(() => useGuestChatMessagesStore())
    const chatMessage = createChatMessage()
    const chatMessageWithSameTimestamp = createChatMessage()
    chatMessageWithSameTimestamp.timestamp = chatMessage.timestamp

    act(() => {
      result.current.addMessage(chatMessage)
      // if the same timestamp, the message should not be added
      result.current.addMessage(chatMessageWithSameTimestamp)
    })

    expect(result.current.messages.length).toBe(1)
    expect(result.current.messages).toEqual([chatMessage])
  })

  test('addMessage should not add more than maxChatMessages', () => {
    const { result } = renderHook(() => useGuestChatMessagesStore())
    const moreThan10 = randomInt(maxChatMessages, maxChatMessages + 10)

    act(() => {
      for (let i = 0; i < moreThan10; i++) {
        const chatMessage = createChatMessage()
        result.current.addMessage(chatMessage)
      }
    })

    expect(result.current.messages.length).toBe(maxChatMessages)
  })

  function createChatMessage(): ChatMessage {
    return {
      id: randomInt(),
      name: randomString(),
      message: randomString(),
      color: randomString(),
      timestamp: randomInt(),
    }
  }
})
