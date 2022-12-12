import useVisitorSender from '@hooks/senders/useVisitorSender'
import { generateKeyPair } from '@hooks/utils/PublicKeyEncryption'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import { BoxKeyPair } from 'tweetnacl'

describe('useVisitorSender', () => {
  const client: any = {
    publish: jest.fn(),
    active: true,
  }
  const hostKeyPair: BoxKeyPair = generateKeyPair()
  const visitorKeyPair: BoxKeyPair = generateKeyPair()
  beforeEach(() => {
    //
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('sendJoinRequest should encrypt WhoIAm and send JoinRequest', () => {
    const setCodename = jest.fn()
    const wsSendUrl = randomString()
    const visitorId = randomString()
    const codename = randomString()
    const passphrase = randomString()

    const { sendJoinRequest } = useVisitorSender(
      client,
      wsSendUrl,
      visitorId,
      visitorKeyPair,
      hostKeyPair.publicKey,
      setCodename
    )

    sendJoinRequest(codename, passphrase)

    expect(client.publish).toHaveBeenCalledTimes(1)
    const expectedJsonRegex = new RegExp(
      '"visitorId":"' + visitorId + '","visitorPublicKey":.+,"whoIAmEnc":.+'
    )
    expect(client.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        destination: wsSendUrl,
        body: expect.stringMatching(expectedJsonRegex),
      })
    )
  })
})
