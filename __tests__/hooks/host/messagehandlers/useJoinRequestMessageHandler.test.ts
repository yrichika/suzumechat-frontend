import { randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useJoinRequestMessageHandler from '@hooks/host/messagehandlers/useJoinRequestMessageHandler'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'
import { createStompClientMockForPublish } from '@testhelpers/doubles/StompClientMock'

describe('useJoinRequestMessageHandler', () => {
  const stompClientPublishMock = jest.fn((params: any) => new Promise(() => {}))
  const wsSendUrl = randomString()
  const hostSecretKey = new Uint8Array(randomInt(1, 100))
  const addManageableJoinRequest = jest.fn(
    (newRequest: ManageableJoinRequest) => {}
  )
  const updateManageableRequest = jest.fn(
    (request: ManageableJoinRequest) => {}
  )

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendCloseJoinRequest should send CloseJoinRequest message if stomp client active', () => {
    const stompClient = createStompClientMockForPublish(
      true,
      stompClientPublishMock
    )

    const { sendCloseJoinRequest } = useJoinRequestMessageHandler(
      stompClient,
      wsSendUrl,
      hostSecretKey,
      addManageableJoinRequest,
      updateManageableRequest
    )

    sendCloseJoinRequest()

    const closeJoinRequest = { joinRequestClosing: true }
    expect(stompClientPublishMock).toHaveBeenNthCalledWith(1, {
      destination: wsSendUrl,
      body: JSON.stringify(closeJoinRequest),
    })
  })

  test('sendCloseJoinRequest should not send CloseJoinRequest message if stomp client not active', () => {
    const stompClient = createStompClientMockForPublish(
      false,
      stompClientPublishMock
    )

    const { sendCloseJoinRequest } = useJoinRequestMessageHandler(
      stompClient,
      wsSendUrl,
      hostSecretKey,
      addManageableJoinRequest,
      updateManageableRequest
    )

    sendCloseJoinRequest()

    expect(stompClientPublishMock).not.toHaveBeenCalled()
  })
})
