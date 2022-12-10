import useManageableJoinRequestsStore from '@stores/useManageableJoinRequestsStore'
import { act, renderHook } from '@testing-library/react'
import { randomBoolean, randomInt, randomString } from '@utils/UnsafeRandom'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'

describe('useManageableJoinRequestsStore', () => {
  beforeEach(() => {
    //
  })

  test('add should add request', () => {
    const { result } = renderHook(() => useManageableJoinRequestsStore())
    const manageableJoinRequest = createManageableJoinRequest()
    act(() => {
      result.current.add(manageableJoinRequest)
    })
    expect(result.current.requests).toEqual([manageableJoinRequest])

    // 2nd request
    const newRequest = createManageableJoinRequest()
    act(() => {
      result.current.add(newRequest)
    })
    expect(result.current.requests).toEqual([manageableJoinRequest, newRequest])
  })

  test('add should not add request if request has the same visitor id', () => {
    const { result } = renderHook(() => useManageableJoinRequestsStore())
    const manageableJoinRequest = createManageableJoinRequest()
    const sameVisitorIdRequest = createManageableJoinRequest()
    // same visitor id
    sameVisitorIdRequest.visitorId = manageableJoinRequest.visitorId
    act(() => {
      result.current.add(manageableJoinRequest)
      result.current.add(sameVisitorIdRequest)
    })

    expect(result.current.requests).toEqual([manageableJoinRequest])
  })

  test('update should update isAuthenticated', () => {
    const { result } = renderHook(() => useManageableJoinRequestsStore())
    const request = createManageableJoinRequest()
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
    const { result } = renderHook(() => useManageableJoinRequestsStore())
    const request = createManageableJoinRequest()

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

  function createManageableJoinRequest(
    isAuthenticated: boolean | null = null
  ): ManageableJoinRequest {
    return {
      visitorId: randomString(),
      codename: randomString(),
      passphrase: randomString(),
      publicKey: new Uint8Array(),
      isAuthenticated,
    }
  }
})
