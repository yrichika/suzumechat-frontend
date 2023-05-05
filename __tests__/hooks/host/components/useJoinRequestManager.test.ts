import { randomBoolean, randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useJoinRequestManager from '@hooks/host/components/useJoinRequestManager'
import React from 'react'

const useJoinRequestAvailabilityStorePropertyMock = jest.fn()
jest.mock(
  '@stores/host/useJoinRequestAvailabilityStore',
  () => (stateCallback: (state: any) => any) =>
    useJoinRequestAvailabilityStorePropertyMock
)

describe('useJoinRequestManager', () => {
  const hostChannelToken = randomString()

  jest.spyOn(React, 'useEffect').mockImplementation(f => f())

  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("showStatus should return 'Not Accepted' string if the argument is null", () => {
    const { showStatus } = useJoinRequestManager(
      hostChannelToken,
      false,
      jest.fn(),
      jest.fn()
    )

    const result = showStatus(null)

    expect(result).toBe('Not Accepted')
  })

  test("showStatus should return 'Rejected' string if the argument is false", () => {
    const { showStatus } = useJoinRequestManager(
      hostChannelToken,
      false,
      jest.fn(),
      jest.fn()
    )

    const result = showStatus(false)

    expect(result).toBe('Rejected')
  })

  test("showStatus should return 'Accepted' string if the argument is true", () => {
    const { showStatus } = useJoinRequestManager(
      hostChannelToken,
      false,
      jest.fn(),
      jest.fn()
    )

    const result = showStatus(true)

    expect(result).toBe('Accepted')
  })

  test('writeStatusClass should return tailwind red color class strings if the argument is null or false', () => {
    const { writeStatusClass } = useJoinRequestManager(
      hostChannelToken,
      false,
      jest.fn(),
      jest.fn()
    )
    const nullOrFalse = randomBoolean() ? null : false
    const result = writeStatusClass(nullOrFalse)

    expect(result).toMatch(/.+red.+/)
    expect(result).not.toMatch(/.+green.+/g)
  })

  test('writeStatusClass should return tailwind green color class strings if the argument is true', () => {
    const { writeStatusClass } = useJoinRequestManager(
      hostChannelToken,
      false,
      jest.fn(),
      jest.fn()
    )

    const result = writeStatusClass(true)

    expect(result).toMatch(/.+green.+/)
    expect(result).not.toMatch(/.+red.+/g)
  })

  test('closeJoinRequest should call functions to close join requests', () => {
    const sendCloseJoinRequestMock = jest.fn()
    const disableSendingManageableJoinRequestMock = jest.fn()
    const setIsClosedMock = jest.fn((isClosed: boolean) => {})
    useJoinRequestAvailabilityStorePropertyMock.mockImplementation(
      setIsClosedMock
    )

    const { closeJoinRequest } = useJoinRequestManager(
      hostChannelToken,
      false,
      sendCloseJoinRequestMock,
      disableSendingManageableJoinRequestMock
    )

    closeJoinRequest()

    expect(sendCloseJoinRequestMock).toHaveBeenCalledTimes(1)
    expect(disableSendingManageableJoinRequestMock).toHaveBeenCalledTimes(1)
    expect(setIsClosedMock).toHaveBeenNthCalledWith(1, true)
  })

  test('useEffect should call clearJoinRequestAvailability if isChannelEnded is true', () => {
    const clearJoinRequestAvailabilityMock = jest.fn()
    useJoinRequestAvailabilityStorePropertyMock.mockImplementation(
      clearJoinRequestAvailabilityMock
    )

    useJoinRequestManager(hostChannelToken, true, jest.fn(), jest.fn())

    expect(clearJoinRequestAvailabilityMock).toHaveBeenCalledTimes(1)
  })

  test('useEffect should not call clearJoinRequestAvailability if isChannelEnded is false', () => {
    const clearJoinRequestAvailabilityMock = jest.fn()
    useJoinRequestAvailabilityStorePropertyMock.mockImplementation(
      clearJoinRequestAvailabilityMock
    )

    useJoinRequestManager(hostChannelToken, false, jest.fn(), jest.fn())

    expect(clearJoinRequestAvailabilityMock).not.toHaveBeenCalled()
  })
})
