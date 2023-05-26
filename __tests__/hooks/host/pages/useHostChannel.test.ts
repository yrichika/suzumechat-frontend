import { randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useHostChannel from '@hooks/host/pages/useHostChannel'
import React from 'react'

const channelNameMock = jest.fn().mockReturnValue(randomString())
const joinChannelTokenMock = jest.fn().mockReturnValue(randomString())
const secretKeyMock = jest.fn().mockReturnValue(randomString())
jest.mock('@stores/host/useHostStore', () =>
  jest.fn((stateCallback: (state: any) => any) => {
    const stateMock = {
      channelName: channelNameMock(),
      joinChannelToken: joinChannelTokenMock(),
      secretKey: secretKeyMock(),
      publicKeyEncKeyPair: {
        publicKey: new Uint8Array(),
        secretKey: new Uint8Array(),
      },
    }
    return stateCallback(stateMock)
  })
)

const routerPushMock = jest.fn()
const hostChannelTokenValue = randomString()
const hostChannelTokenMock = jest.fn().mockReturnValue(hostChannelTokenValue)
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (redirectTo: string) => routerPushMock(redirectTo),
      query: {
        hostChannelToken: hostChannelTokenMock(),
      },
    }
  },
}))

const endChatService = jest.fn(
  (guestChannelToken: string) => new Promise(() => {})
)
jest.mock(
  '@services/host/endChannelService',
  () => (hostChannelToken: string) => endChatService(hostChannelToken)
)

describe('useHostChannel', () => {
  const setIsChatEndedMock = jest.fn()
  const useStateMock = (useState: any) => [useState, setIsChatEndedMock]
  jest.spyOn(React, 'useState').mockImplementation(useStateMock as any)

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('endChannel should set isChannelEnded true and call endChatService', () => {
    const { endChannel } = useHostChannel()

    endChannel()

    expect(setIsChatEndedMock).toHaveBeenNthCalledWith(1, true)
    expect(endChatService).toHaveBeenNthCalledWith(1, hostChannelTokenValue)
  })

  test('isPageNotReady should return false if all the necessary elements exist', () => {
    const { isPageNotReady } = useHostChannel()

    const result = isPageNotReady()

    expect(result).toBe(false)
  })

  test('isPageNotReady should return true if any of the elements does not exist', () => {
    const necessaryElements: Array<jest.Mock<any, any>> = [
      hostChannelTokenMock,
      channelNameMock,
      joinChannelTokenMock,
      secretKeyMock,
    ]

    necessaryElements[
      randomInt(0, necessaryElements.length - 1)
    ].mockReturnValueOnce(undefined)

    const { isPageNotReady } = useHostChannel()

    const result = isPageNotReady()

    expect(result).toBe(true)
  })
})
