import useManagedJoinRequestsStore from '@stores/useManagedJoinRequestsStore'
import { act, renderHook } from '@testing-library/react'
import { randomBoolean, randomInt, randomString } from '@utils/UnsafeRandom'
import ManagedJoinRequest from 'types/messages/ManagedJoinRequest'

describe('useManagedJoinRequestsStore', () => {
  beforeEach(() => {
    //
  })

  test('add should add request', () => {
    const { result } = renderHook(() => useManagedJoinRequestsStore())
    const managedJoinRequest = createManagedJoinRequest()
    act(() => {
      result.current.add(managedJoinRequest)
    })
    expect(result.current.requests).toEqual([managedJoinRequest])

    // 2nd request
    const newRequest = createManagedJoinRequest()
    act(() => {
      result.current.add(newRequest)
    })
    expect(result.current.requests).toEqual([managedJoinRequest, newRequest])
  })

  test('add should not add request if request has the same visitor id', () => {
    const { result } = renderHook(() => useManagedJoinRequestsStore())
    const managedJoinRequest = createManagedJoinRequest()
    const sameVisitorIdRequest = createManagedJoinRequest()
    // same visitor id
    sameVisitorIdRequest.visitorId = managedJoinRequest.visitorId
    act(() => {
      result.current.add(managedJoinRequest)
      result.current.add(sameVisitorIdRequest)
    })

    expect(result.current.requests).toEqual([managedJoinRequest])
  })

  test('update should update isAuthenticated', () => {
    const { result } = renderHook(() => useManagedJoinRequestsStore())
    const request = createManagedJoinRequest()
    const clonedRequest = { ...request } // or Object.assign({}, request)
    const expected = randomBoolean()
    clonedRequest.isAuthenticated = expected

    act(() => {
      result.current.add(request)
    })
    expect(result.current.requests[0].isAuthenticated).toBeNull()

    act(() => {
      result.current.update(clonedRequest)
    })
    expect(result.current.requests[0].isAuthenticated).toBe(expected)
  })

  test("update should not update request's isAuthenticated that does not match visitor id", () => {
    const { result } = renderHook(() => useManagedJoinRequestsStore())
    const request = createManagedJoinRequest()

    const clonedRequest = { ...request }
    // different visitor id
    clonedRequest.visitorId = randomString(6)
    clonedRequest.isAuthenticated = randomBoolean()

    act(() => {
      result.current.add(request)
    })
    expect(result.current.requests[0].isAuthenticated).toBeNull()

    act(() => {
      result.current.update(clonedRequest)
    })
    expect(result.current.requests[0].isAuthenticated).toBeNull()
  })

  function createManagedJoinRequest(
    isAuthenticated: boolean | null = null
  ): ManagedJoinRequest {
    return {
      visitorId: randomString(),
      codename: randomString(),
      passphrase: randomString(),
      isAuthenticated,
    }
  }
})
