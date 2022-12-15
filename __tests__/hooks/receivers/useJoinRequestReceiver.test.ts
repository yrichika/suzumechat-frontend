import useJoinRequestReceiver from '@hooks/receivers/useJoinRequestReceiver'
import { encrypt, generateKeyPair } from '@hooks/utils/PublicKeyEncryption'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import { BoxKeyPair, box } from 'tweetnacl'
import JoinRequest from 'types/messages/JoinRequest'
import { encode as encodeBase64 } from '@stablelib/base64'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'
import WhoIAm from 'types/messages/WhoIAm'

describe('useJoinRequestReceiver', () => {
  const hostKeyPair: BoxKeyPair = generateKeyPair()
  const visitorKeyPair: BoxKeyPair = generateKeyPair()
  const visitorSendingKey = box.before(
    hostKeyPair.publicKey,
    visitorKeyPair.secretKey
  )
  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('receiveJoinRequest should convert JoinRequest to ManageableJoinRequest and call addJoinRequest', () => {
    const addManageableJoinRequest = jest.fn()
    const whoIAm: WhoIAm = {
      codename: randomString(),
      passphrase: randomString(),
    }
    const whoIAmEnc = encrypt(visitorSendingKey, whoIAm)
    const joinRequest: JoinRequest = {
      visitorId: randomString(),
      visitorPublicKey: encodeBase64(visitorKeyPair.publicKey),
      whoIAmEnc: whoIAmEnc,
    }
    const expectedArgument: ManageableJoinRequest = {
      visitorId: joinRequest.visitorId,
      codename: whoIAm.codename,
      passphrase: whoIAm.passphrase,
      publicKey: visitorKeyPair.publicKey,
      isAuthenticated: null,
      isSendable: true,
    }

    const { receiveJoinRequest } = useJoinRequestReceiver(
      addManageableJoinRequest,
      hostKeyPair.secretKey
    )

    receiveJoinRequest(joinRequest)

    expect(addManageableJoinRequest).toHaveBeenNthCalledWith(
      1,
      expectedArgument
    )
  })
})
