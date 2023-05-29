import { randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useHostSender, {
  CHANNEL_ENDED_MESSAGE,
} from '@hooks/host/messagehandlers/senders/useHostSender'
import { createStompClientMockForPublish } from '@testhelpers/doubles/StompClientMock'

describe('useHostSender', () => {
  const stompClientPublishMock = jest.fn((params: any) => new Promise(() => {}))
  const wsSendUrl = randomString()
  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendTerminateMessage should send Terminate message if stomp client active', () => {
    const stompClient = createStompClientMockForPublish(
      true,
      stompClientPublishMock
    )

    const { sendTerminateMessage } = useHostSender(stompClient, wsSendUrl)

    sendTerminateMessage()

    const expectedMessage = {
      terminatedBy: 'host',
      message: CHANNEL_ENDED_MESSAGE,
      data: null,
    }
    expect(stompClientPublishMock).toHaveBeenNthCalledWith(1, {
      destination: wsSendUrl,
      body: JSON.stringify(expectedMessage),
    })
  })

  test('sendTerminateMessage should not send Terminate message if stomp client not active', () => {
    const stompClient = createStompClientMockForPublish(
      false,
      stompClientPublishMock
    )

    const { sendTerminateMessage } = useHostSender(stompClient, wsSendUrl)

    sendTerminateMessage()

    expect(stompClientPublishMock).not.toHaveBeenCalled()
  })
})
