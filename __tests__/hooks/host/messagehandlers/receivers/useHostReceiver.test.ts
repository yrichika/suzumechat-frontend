import useHostReceiver from '@hooks/host/messagehandlers/receivers/useHostReceiver'
import { randomString } from '@utils/UnsafeRandom'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import JoinRequest from 'types/messages/JoinRequest'
import { expect } from '@jest/globals'

describe('useHostReceiver', () => {
  let receiveUrl: string
  const receiveChatMessage: (messageBody: any) => void = jest.fn()
  const receiveJoinRequest: (messageBody: any) => void = jest.fn()

  beforeEach(() => {
    receiveUrl = randomString()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('receive should call receiveChatMessage if message body is ChatMessageCapsule', () => {
    const messageBody: ChatMessageCapsule = { encryptedMessage: randomString() }
    const message: any = {
      body: JSON.stringify(messageBody),
    }
    const { receive } = useHostReceiver(
      receiveUrl,
      receiveChatMessage,
      receiveJoinRequest
    )

    receive(message)

    expect(receiveChatMessage).toHaveBeenNthCalledWith(1, messageBody)

    expect(receiveJoinRequest).not.toHaveBeenCalled()
  })

  test('receive should call receiveJoinRequest if message body is JoinRequest', () => {
    const messageBody: JoinRequest = {
      visitorId: randomString(),
      visitorPublicKey: randomString(),
      whoIAmEnc: randomString(),
    }
    const message: any = {
      body: JSON.stringify(messageBody),
    }

    const { receive } = useHostReceiver(
      receiveUrl,
      receiveChatMessage,
      receiveJoinRequest
    )

    receive(message)

    expect(receiveJoinRequest).toHaveBeenNthCalledWith(1, messageBody)

    expect(receiveChatMessage).not.toHaveBeenCalled()
  })
})
