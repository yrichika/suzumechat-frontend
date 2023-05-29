import {
  randomInt,
  randomString,
  randomTailwindColor,
} from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useGuestMessageHandler from '@hooks/guest/components/useGuestMessageHandler'
import React from 'react'
import { Client } from '@stomp/stompjs'

// Not directory used in useGuestMessageHandler
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (redirectTo: string) => jest.fn(),
    }
  },
}))

const useGuestChatMessagesStorePropertyMock = jest.fn()
jest.mock(
  '@stores/guest/useGuestChatMessagesStore',
  () => (stateCallback: (state: any) => any) =>
    useGuestChatMessagesStorePropertyMock
)

const connectMock = jest.fn()
jest.mock('@hooks/stomp/config', () => ({
  connect: (stompClient: Client, onConnect: (stompClient: Client) => any) =>
    connectMock(stompClient, onConnect),
}))

const stompClientDeactivateMock = jest.fn(() => new Promise(() => {}))
const stompClientActive = jest.fn().mockReturnValue(true)
jest.mock(
  '@stores/useVisitorGuestSharedStompClientStore',
  () => (stateCallback: (state: any) => any) => ({
    active: stompClientActive(),
    deactivate: () => stompClientDeactivateMock(),
  })
)

describe('useGuestMessageHandler', () => {
  const guestChannelToken = randomString()
  const codename = randomString()
  const secretKey = randomString()
  const color = randomTailwindColor()

  jest.spyOn(React, 'useEffect').mockImplementation(f => f())

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('disconnect should call stomp client deactivate if active', () => {
    // this is just to make clear that it returns true
    stompClientActive.mockReturnValueOnce(true) // or mockImplementation(() => true)

    const { disconnect } = useGuestMessageHandler(
      guestChannelToken,
      codename,
      secretKey,
      color,
      () => {}
    )

    disconnect()

    expect(stompClientDeactivateMock).toHaveBeenCalledTimes(1)
  })

  test('disconnect should not call stomp client deactivate if not active', () => {
    stompClientActive.mockReturnValueOnce(false) // or mockImplementation(() => false)

    const { disconnect } = useGuestMessageHandler(
      guestChannelToken,
      codename,
      secretKey,
      color,
      () => {}
    )

    disconnect()

    expect(stompClientDeactivateMock).not.toHaveBeenCalled()
  })

  test('useEffect should call connect and setInterval in useEffect', () => {
    const shiftChatMessageIfOldMock = jest.fn()
    useGuestChatMessagesStorePropertyMock.mockImplementation(
      shiftChatMessageIfOldMock
    )
    useGuestMessageHandler(
      guestChannelToken,
      codename,
      secretKey,
      color,
      () => {}
    )

    expect(connectMock).toHaveBeenCalledTimes(1)
    jest.runOnlyPendingTimers()
    expect(shiftChatMessageIfOldMock).toHaveBeenCalledTimes(1)
  })
})
