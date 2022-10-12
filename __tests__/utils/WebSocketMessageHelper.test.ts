import { randomString } from '@utils/UnsafeRandom'
import {
  hasAllPropertiesOf,
  isChatMessageCapsuleMessage,
  isJoinRequestMessage,
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
      const propertyName = randomString(5)
      object[propertyName] = randomString(5)
      propertyNames.push(propertyName)
    }

    propertyNames.push(randomString(10))

    const result = hasAllPropertiesOf(object, propertyNames)
    expect(result).toBe(false)
  })

  test('isChatMessageCapsuleMessage should return true if message has all properties of ChatMessageCapsule', () => {
    const message = { encryptedMessage: randomString(5) }
    const result = isChatMessageCapsuleMessage(message)
    expect(result).toBe(true)
  })

  test('isChatMessageCapsuleMessage should return false if message does not have any property of ChatMessageCapsule', () => {
    const message = { [randomString(5)]: randomString(5) }
    const result = isChatMessageCapsuleMessage(message)
    expect(result).toBe(false)
  })

  test('isJoinRequestMessage should return true if message has all props of JoinRequest', () => {
    const message = {
      visitorId: randomString(5),
      codename: randomString(5),
      passphrase: randomString(5),
    }
    const result = isJoinRequestMessage(message)
    expect(result).toBe(true)
  })

  test('isJoinRequestMessage should return false if message does not have any props of JoinRequest', () => {
    const message = {
      [randomString(5)]: randomString(5),
      codename: randomString(5),
      passphrase: randomString(5),
    }
    const result = isJoinRequestMessage(message)
    expect(result).toBe(false)
  })
})
