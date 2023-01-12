import useManageableJoinRequestsStore from '@stores/host/useManageableJoinRequestsStore'
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

  test('update should update isAuthenticated and set isSendable false', () => {
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
    expect(result.current.requests[0].isSendable).toBe(false)
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

  test('disableSending should set all requests isSendable false', () => {
    const { result } = renderHook(() => useManageableJoinRequestsStore())
    const howMany = randomInt(1, 5)
    let requests: ManageableJoinRequest[] = []
    for (let i = 0; i < howMany; i++) {
      requests.push(createManageableJoinRequest())
    }

    act(() => {
      requests.forEach(request => {
        result.current.add(request)
      })
    })
    result.current.requests.forEach(request => {
      expect(request.isSendable).toBe(true)
    })

    act(() => {
      result.current.disableSending()
    })

    result.current.requests.forEach(request => {
      expect(request.isSendable).toBe(false)
    })
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
      isSendable: true,
    }
  }
})
