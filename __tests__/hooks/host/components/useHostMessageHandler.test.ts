import {
  randomInt,
  randomString,
  randomTailwindColor,
} from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useHostMessageHandler from '@hooks/host/components/useHostMessageHandler'
import React from 'react'
import { Client } from '@stomp/stompjs'
import StorageMock from '@testhelpers/doubles/StorageMock'

const useHostChatMessagesStorePropertyMock = jest.fn()
jest.mock(
  '@stores/host/useHostChatMessagesStore',
  () => (stateCallback: (state: any) => any) =>
    useHostChatMessagesStorePropertyMock
)

jest.mock(
  '@stores/host/useManageableJoinRequestsStore',
  () => (stateCallback: (state: any) => any) => jest.fn()
)

const sendTerminateMessageMock = jest.fn()
jest.mock(
  '@hooks/host/messagehandlers/senders/useHostSender',
  () => (stompClient: Client, wsSendUrl: string) => ({
    sendTerminateMessage: () => sendTerminateMessageMock(),
  })
)

const connectMock = jest.fn()
jest.mock('@hooks/stomp/config', () => ({
  connect: (stompClient: Client, onConnect: (stompClient: Client) => any) =>
    connectMock(stompClient, onConnect),
}))

describe('useHostMessageHandler', () => {
  const hostChannelToken = randomString()
  const codename = randomString()
  const secretKey = randomString()
  const publicKeyEncSecretKey = new Uint8Array(randomInt(1, 10))
  const color = randomTailwindColor()

  const stompClientDeactivateMock = jest.fn(() => new Promise(() => {}))
  const stompClientActive = jest.fn().mockReturnValue(true)
  const stompClientMock = jest.fn(() => ({
    active: stompClientActive(),
    deactivate: () => stompClientDeactivateMock(),
  }))
  const useStateMock = (useState: any) => [stompClientMock(), jest.fn()]
  jest.spyOn(React, 'useState').mockImplementation(useStateMock as any)

  jest.spyOn(React, 'useEffect').mockImplementation(f => f())

  const sessionStorageMock = new StorageMock()
  sessionStorageMock.clear = jest.fn()
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  })

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('disconnect should call functions to end chat channel', () => {
    stompClientActive.mockReturnValueOnce(true)

    const { disconnect } = useHostMessageHandler(
      hostChannelToken,
      codename,
      secretKey,
      publicKeyEncSecretKey,
      color
    )

    disconnect()

    expect(sendTerminateMessageMock).toHaveBeenCalledTimes(1)
    expect(sessionStorageMock.clear).toHaveBeenCalledTimes(1)
    expect(stompClientDeactivateMock).toHaveBeenCalledTimes(1)
  })

  test('disconnect should not call stompClient.deactivate if already deactivated', () => {
    stompClientActive.mockReturnValueOnce(false)

    const { disconnect } = useHostMessageHandler(
      hostChannelToken,
      codename,
      secretKey,
      publicKeyEncSecretKey,
      color
    )

    disconnect()

    expect(sendTerminateMessageMock).toHaveBeenCalledTimes(1)
    expect(sessionStorageMock.clear).toHaveBeenCalledTimes(1)
    expect(stompClientDeactivateMock).not.toHaveBeenCalled() // this is different
  })

  test('useEffect should call connect and setInterval in useEffect', () => {
    const shiftChatMessageIfOldMock = jest.fn()
    useHostChatMessagesStorePropertyMock.mockImplementation(
      shiftChatMessageIfOldMock
    )
    useHostMessageHandler(
      hostChannelToken,
      codename,
      secretKey,
      publicKeyEncSecretKey,
      color
    )

    expect(connectMock).toHaveBeenCalledTimes(1)
    jest.runOnlyPendingTimers()
    expect(shiftChatMessageIfOldMock).toHaveBeenCalledTimes(1)
  })
})
