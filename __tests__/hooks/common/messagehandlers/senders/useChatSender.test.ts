import useChatSender from '@hooks/common/messagehandlers/senders/useChatSender'
import {
  randomInt,
  randomString,
  randomTailwindColor,
} from '@utils/UnsafeRandom'
import ChatUserAppearance from 'types/ChatUserAppearance'
import { expect } from '@jest/globals'

describe('useChatSender', () => {
  let client: any
  let appearance: ChatUserAppearance
  beforeEach(() => {
    client = {
      publish: jest.fn(),
      active: true,
    }
    appearance = {
      codename: randomString(),
      color: randomTailwindColor(),
    }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendChatMessage should send message by stomp client', () => {
    const url = randomString()
    const index = randomInt()
    const secretKey = randomString()
    const message = randomString()

    const { sendChatMessage } = useChatSender(
      client,
      url,
      index,
      appearance,
      secretKey
    )

    sendChatMessage(message)

    expect(client.publish).toHaveBeenCalledTimes(1)
    expect(client.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: url,
        // `encryptedMessage` is the only MessageCapsule property name
        body: expect.stringContaining('encryptedMessage'),
      })
    )
  })
})
