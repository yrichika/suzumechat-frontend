import useChatSender from '@hooks/senders/useChatSender'
import { Client } from '@stomp/stompjs'
import { randomString, randomInt } from '@utils/UnsafeRandom'
import ChatUserAppearance from 'types/ChatUserAppearance'

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
      color: randomString(),
    }
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendChatMessage should', () => {
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
