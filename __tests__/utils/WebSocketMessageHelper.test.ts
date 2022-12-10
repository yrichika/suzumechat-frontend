import { randomBoolean, randomString } from '@utils/UnsafeRandom'
import {
  hasAllPropertiesOf,
  isAuthenticationStatus,
  isChatMessageCapsule,
  isErrorMessage,
  isJoinRequest,
  isTerminate,
} from '@utils/WebSocketMessageHelper'
import { randomInt } from 'crypto'

describe('sonHelper', () => {
  beforeEach(() => {})
  test('hasAllPropertiesOf should return true if object has all properties', () => {
    const propertyNames = []
    let object: any = {}
    const numProperties = randomInt(5)
    for (let i = 0; i < numProperties; i++) {
      const propertyName = randomString(5)
      object[propertyName] = randomString(5)
      propertyNames.push(propertyName)
    }

    const result = hasAllPropertiesOf(object, propertyNames)
    expect(result).toBe(true)
  })

  test('hasAllPropertiesOf should return false if object does not have any of the specified properties', () => {
    const propertyNames = []
    let object: any = {}
    const maxNumProperties = 5
    const numProperties = randomInt(maxNumProperties)
    for (let i = 0; i < numProperties; i++) {
      const propertyName = randomString()
      object[propertyName] = randomString()
      propertyNames.push(propertyName)
    }

    propertyNames.push(randomString(10))

    const result = hasAllPropertiesOf(object, propertyNames)
    expect(result).toBe(false)
  })

  test('isChatMessageCapsule should return true if message has all properties of ChatMessageCapsule', () => {
    const message = { encryptedMessage: randomString() }
    const result = isChatMessageCapsule(message)
    expect(result).toBe(true)
  })

  test('isChatMessageCapsule should return false if message does not have any property of ChatMessageCapsule', () => {
    const message = { [randomString()]: randomString() }
    const result = isChatMessageCapsule(message)
    expect(result).toBe(false)
  })

  test('isJoinRequest should return true if message has all props of JoinRequest', () => {
    const message = {
      visitorId: randomString(),
      visitorPublicKey: randomString(),
      whoIAmEnc: randomString(),
    }
    const result = isJoinRequest(message)
    expect(result).toBe(true)
  })

  test('isJoinRequest should return false if message does not have any props of JoinRequest', () => {
    const message = {
      [randomString()]: randomString(),
      visitorPublicKey: randomString(),
      whoIAmEnc: randomString(),
    }
    const result = isJoinRequest(message)
    expect(result).toBe(false)
  })

  test('isAuthenticationStatus should return true if message has all props of AuthenticationStatus', () => {
    const message = {
      isClosed: randomBoolean(),
      isAuthenticated: randomBoolean(),
      guestId: randomString(),
      guestChannelToken: randomString(),
      channelName: randomString(),
      secretKey: randomString(),
    }
    const result = isAuthenticationStatus(message)
    expect(result).toBe(true)
  })

  test('isAuthenticationStatus should return false if message does not have all props of AuthenticationStatus', () => {
    const message = {
      [randomString()]: randomBoolean(),
      isAuthenticated: randomBoolean(),
      guestId: randomString(),
      guestChannelToken: randomString(),
      channelName: randomString(),
      secretKey: randomString(),
    }
    const result = isAuthenticationStatus(message)
    expect(result).toBe(false)
  })

  test('isTerminate should return true if message has all props of Terminate', () => {
    const message = {
      terminatedBy: null,
      message: null,
      data: null,
    }
    const result = isTerminate(message)
    expect(result).toBe(true)
  })

  test('isTerminate should return false if message does not have all props of Terminate', () => {
    const message = {
      [randomString()]: randomBoolean(),
      message: null,
      data: null,
    }
    const result = isTerminate(message)
    expect(result).toBe(false)
  })

  test('isErrorMessage should return true if message has all props of ErrorMessage', () => {
    const message = {
      isError: true,
      type: randomString(),
    }
    const result = isErrorMessage(message)
    expect(result).toBe(true)
  })

  test('isErrorMessage should return false if message does not have all props of ErrorMessage', () => {
    const message = {
      [randomString()]: randomBoolean(),
      type: randomString(),
    }
    const result = isErrorMessage(message)
    expect(result).toBe(false)
  })
})
