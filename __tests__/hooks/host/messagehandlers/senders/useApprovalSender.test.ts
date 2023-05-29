import { randomBoolean, randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useApprovalSender from '@hooks/host/messagehandlers/senders/useApprovalSender'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'
import { random } from 'cypress/types/lodash'
import { createStompClientMockForPublish } from '@testhelpers/doubles/StompClientMock'

describe('useApprovalSender', () => {
  const stompClientPublishMock = jest.fn((params: any) => new Promise(() => {}))

  const wsSendUrl = randomString()
  const updateManageableJoinRequest = jest.fn(
    (request: ManageableJoinRequest) => {}
  )

  const manageableJoinRequest = {
    visitorId: randomString(),
    codename: randomString(),
    passphrase: randomString(),
    publicKey: new Uint8Array(randomInt(0, 100)),
    isAuthenticated: null,
    isSendable: true,
  }

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendApproval should send approval and update join request status if stomp client is active', () => {
    const stompClient = createStompClientMockForPublish(
      true,
      stompClientPublishMock
    )

    const { sendApproval } = useApprovalSender(
      stompClient,
      wsSendUrl,
      updateManageableJoinRequest
    )

    const isAuthenticated = randomBoolean()
    sendApproval(manageableJoinRequest, isAuthenticated)

    expect(stompClientPublishMock).toHaveBeenNthCalledWith(1, {
      destination: wsSendUrl,
      body: JSON.stringify({
        visitorId: manageableJoinRequest.visitorId,
        isAuthenticated: isAuthenticated,
      }),
    })

    const expectedUpdatedManageableJoinRequest = Object.assign(
      manageableJoinRequest,
      {
        isAuthenticated: isAuthenticated,
      }
    )
    expect(updateManageableJoinRequest).toHaveBeenNthCalledWith(
      1,
      expectedUpdatedManageableJoinRequest
    )
  })

  test('sendApproval should not send approval if stomp client is not active', () => {
    const stompClient = createStompClientMockForPublish(
      false,
      stompClientPublishMock
    )
    const isAuthenticated = randomBoolean()

    const { sendApproval } = useApprovalSender(
      stompClient,
      wsSendUrl,
      updateManageableJoinRequest
    )

    sendApproval(manageableJoinRequest, isAuthenticated)

    expect(stompClientPublishMock).not.toHaveBeenCalled()
    expect(updateManageableJoinRequest).not.toHaveBeenCalled()
  })
})
