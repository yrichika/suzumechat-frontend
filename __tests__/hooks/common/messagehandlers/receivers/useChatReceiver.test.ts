import useChatReceiver from '@hooks/common/messagehandlers/receivers/useChatReceiver'
import { encrypt } from '@hooks/utils/ChatMessageCrypter'
import { randomString, randomInt } from '@utils/UnsafeRandom'
import ChatMessage from 'types/ChatMessage'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'

describe('useChatReceiver', () => {
  let chatMessage: ChatMessage
  beforeEach(() => {
    chatMessage = {
      id: randomInt(),
      name: randomString(),
      message: randomString(),
      color: randomString(),
      timestamp: randomInt(),
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('receiveChatMessage should decrypt message and call addChatMessage', () => {
    const addChatMessage = jest.fn()
    const secretKey = randomString()
    const encryptedMessage = encrypt(chatMessage, secretKey)
    const messageBody = { encryptedMessage } as ChatMessageCapsule

    const { receiveChatMessage } = useChatReceiver(addChatMessage, secretKey)
    receiveChatMessage(messageBody)

    expect(addChatMessage).toHaveBeenNthCalledWith(1, chatMessage)
  })
})
