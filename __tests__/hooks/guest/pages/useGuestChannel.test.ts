import { randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useGuestChannel from '@hooks/guest/pages/useGuestChannel'
import React from 'react'
import StorageMock from '@testhelpers/doubles/StorageMock'

const routerPushMock = jest.fn()
const guestChannelToken = randomString()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (redirectTo: string) => routerPushMock(redirectTo),
      query: {
        guestChannelToken,
      },
    }
  },
}))

const endChatService = jest.fn(
  (guestChannelToken: string) => new Promise(() => {})
)
jest.mock(
  '@services/guest/endChatService',
  () => (guestChannelToken: string) => endChatService(guestChannelToken)
)

const useGuestStorePropertyMock = jest.fn()
jest.mock(
  '@stores/guest/useGuestStore',
  () => (stateCallback: (state: any) => any) => useGuestStorePropertyMock
)

describe('useGuestChannel', () => {
  const sessionStorageMock = new StorageMock()
  sessionStorageMock.clear = jest.fn()
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  })
  const REDIRECT_TO = '/guest/ended'

  const setIsChatEndedMock = jest.fn()
  const useStateMock = (useState: any) => [useState, setIsChatEndedMock]
  jest.spyOn(React, 'useState').mockImplementation(useStateMock as any)

  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('endChannel should call setIsChatEnded with true and endChatService', () => {
    const { endChannel } = useGuestChannel()

    endChannel()

    expect(setIsChatEndedMock).toHaveBeenNthCalledWith(1, true)
    expect(endChatService).toHaveBeenNthCalledWith(1, guestChannelToken)
  })

  test('endChat should clear storage and redirect to chat ended page', () => {
    const clearGuestStoreMock = jest.fn()
    useGuestStorePropertyMock.mockImplementation(clearGuestStoreMock)
    const { endChat } = useGuestChannel()

    endChat()

    expect(clearGuestStoreMock).toHaveBeenCalledTimes(1)
    expect(sessionStorageMock.clear).toHaveBeenCalledTimes(1)
    expect(routerPushMock).toHaveBeenNthCalledWith(1, REDIRECT_TO)
  })
})
