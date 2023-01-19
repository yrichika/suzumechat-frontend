import useChat from '@hooks/common/components/useChat'
import { act, renderHook } from '@testing-library/react'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'

describe('useChat', () => {
  const sendChatMessage = jest.fn()
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('handleMessage should call sendChatMessage and clear messageInput', () => {
    const message = randomString()
    const { result } = renderHook(() => useChat(sendChatMessage))
    act(() => {
      result.current.setMessageInput(message)
    })
    expect(result.current.messageInput).toBe(message)

    act(() => {
      result.current.handleMessage()
    })
    expect(sendChatMessage).toHaveBeenNthCalledWith(1, message)
    expect(result.current.messageInput).toBe('')
  })

  test('handleMessage should not call sendChatMessage if messageInput is empty', () => {
    const { result } = renderHook(() => useChat(sendChatMessage))

    act(() => {
      result.current.handleMessage()
    })
    expect(sendChatMessage).not.toHaveBeenCalled()
  })

  test('sendShortcut should call sendChatMessage and clear messageInput', () => {
    const message = randomString()
    const { result } = renderHook(() => useChat(sendChatMessage))
    const event: any = {
      shiftKey: true,
      key: 'Enter',
      preventDefault: () => {},
    }

    act(() => {
      result.current.setMessageInput(message)
    })
    expect(result.current.messageInput).toBe(message)

    act(() => {
      result.current.sendShortcut(event)
    })
    expect(sendChatMessage).toHaveBeenNthCalledWith(1, message)
    expect(result.current.messageInput).toBe('')
  })
})
