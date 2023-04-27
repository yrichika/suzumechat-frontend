import {
  randomInt,
  randomString,
  randomTailwindColor,
} from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useGuestMessageHandler from '@hooks/guest/components/useGuestMessageHandler'
import React from 'react'

// Not directory used in useGuestMessageHandler
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (redirectTo: string) => jest.fn(),
    }
  },
}))

const shiftChatMessageIfOldMock = jest.fn()
jest.mock(
  '@stores/guest/useGuestChatMessagesStore',
  () => (store: any) =>
    jest.fn(() => ({
      shiftChatMessageIfOld: shiftChatMessageIfOldMock(),
    }))
)

const connectMock = jest.fn()
jest.mock('@hooks/stomp/config', () => ({
  connect: () => connectMock(),
}))

const stompClientDeactivateMock = jest.fn(() => new Promise(() => {}))
const stompClientActive = jest.fn().mockReturnValue(true)
jest.mock(
  '@stores/useVisitorGuestSharedStompClientStore',
  () => (store: any) => ({
    active: stompClientActive(),
    deactivate: () => stompClientDeactivateMock(),
  })
)

describe('useGuestMessageHandler', () => {
  const guestChannelToken = randomString()
  const codename = randomString()
  const secretKey = randomString()
  const color = randomTailwindColor()

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('disconnect should call stomp client deactivate if active', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f())
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
    jest.spyOn(React, 'useEffect').mockImplementation(f => f())
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

  test('useEffect should call connect and setInterval', () => {
    jest.spyOn(React, 'useEffect').mockImplementation(f => f())

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
