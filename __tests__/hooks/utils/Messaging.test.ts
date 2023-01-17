import { handleWithMatchedHandler } from '@hooks/utils/Messaging'
import { randomInt, randomString } from '@utils/UnsafeRandom'

describe('Messaging', () => {
  let handler: (message: any) => void
  const truePredicate = (m: any) => true
  const falsePredicate = (m: any) => false

  beforeEach(() => {
    handler = jest.fn()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('handleWithMatchedHandler should call handler if predicate returns true', () => {
    const mockHandlers = new Map<
      (message: any) => boolean,
      (message: any) => void
    >([[truePredicate, handler]])
    const message = {}

    handleWithMatchedHandler(message, mockHandlers)

    expect(handler).toHaveBeenNthCalledWith(1, message)
  })

  test("handleWithMatchedHandler should only call a matched handler once even if another handler's predicate returns true", () => {
    const shouldNotBeCalledHandler = jest.fn()
    // creating another function name not to conflict in Map keys
    const anotherTruePredicate = (m: any) => true

    const mockHandlers = new Map<
      (message: any) => boolean,
      (message: any) => void
    >([
      [truePredicate, handler],
      [anotherTruePredicate, shouldNotBeCalledHandler],
    ])
    const message = {}

    handleWithMatchedHandler(message, mockHandlers)

    expect(handler).toHaveBeenNthCalledWith(1, message)
    expect(shouldNotBeCalledHandler).not.toHaveBeenCalled()
  })

  test('handleWithMatchedHandler should log if no handler called', () => {
    console.warn = jest.fn()

    const mockHandlers = new Map<
      (message: any) => boolean,
      (message: any) => void
    >([[falsePredicate, handler]])
    const message = {}

    handleWithMatchedHandler(message, mockHandlers)

    expect(console.warn).toHaveBeenCalledTimes(1)
  })
})
