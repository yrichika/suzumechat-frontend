import { randomInt, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import useGuestReceiver from '@hooks/guest/messagehandlers/receivers/useGuestReceiver'
import ChatMessageCapsule from 'types/messages/ChatMessageCapsule'
import Terminate from 'types/messages/Terminate'
import StorageMock from '@testhelpers/doubles/StorageMock'

const routerPushMock = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (redirectTo: string) => routerPushMock(redirectTo),
    }
  },
}))

const handleWithMatchedHandlerMock = jest.fn()
jest.mock('@hooks/utils/Messaging', () => ({
  handleWithMatchedHandler: (messageBody: any, messageHandlers: any) =>
    // messageHandlers complicates the test. So just ignoring it for now
    handleWithMatchedHandlerMock(messageBody),
}))

const endChatService = jest.fn(
  (guestChannelToken: string) => new Promise(() => {})
)
jest.mock(
  '@services/guest/endChatService',
  () => (guestChannelToken: string) => endChatService(guestChannelToken)
)

describe('useGuestReceiver', () => {
  const guestChannelToken = randomString()
  const receiveChatMessage: (messageBody: any) => void = jest.fn()
  const clearGuestStore: () => void = jest.fn()
  const disconnect: () => Promise<void> = jest.fn(() => new Promise(() => {}))

  const sessionStorageMock = new StorageMock()
  sessionStorageMock.clear = jest.fn()
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
  })

  const REDIRECT_TO = '/guest/ended?byWho=host'

  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('receive should call handleWithMatchedHandler with received message', () => {
    const messageBody: ChatMessageCapsule = { encryptedMessage: randomString() }
    const message: any = {
      body: JSON.stringify(messageBody),
    }

    const { receive } = useGuestReceiver(
      guestChannelToken,
      receiveChatMessage,
      clearGuestStore,
      disconnect
    )

    receive(message)

    expect(handleWithMatchedHandlerMock).toHaveBeenNthCalledWith(1, messageBody)
  })

  test('handleTerminate should end chat and redirect to chat ended page', () => {
    const terminate: Terminate = {
      terminatedBy: null,
      message: null,
      data: null,
    }
    const { handleTerminate } = useGuestReceiver(
      guestChannelToken,
      receiveChatMessage,
      clearGuestStore,
      disconnect
    )

    handleTerminate(terminate)

    expect(disconnect).toHaveBeenCalledTimes(1)
    expect(endChatService).toHaveBeenNthCalledWith(1, guestChannelToken)
  })

  test('endChat should clear storage and redirect to chat ended page', () => {
    const { endChat } = useGuestReceiver(
      guestChannelToken,
      receiveChatMessage,
      clearGuestStore,
      disconnect
    )

    endChat()

    expect(clearGuestStore).toHaveBeenCalledTimes(1)
    expect(sessionStorageMock.clear).toHaveBeenCalledTimes(1)
    expect(routerPushMock).toHaveBeenNthCalledWith(1, REDIRECT_TO)
  })
})
