import { encrypt } from '@hooks/utils/PublicKeyEncryption'
import { box, BoxKeyPair } from 'tweetnacl'
import WhoIAm from 'types/messages/WhoIAm'
import { encode as encodeBase64 } from '@stablelib/base64'
import JoinRequest from 'types/messages/JoinRequest'
import { isInactive } from '@hooks/stomp/config'
import { Client } from '@stomp/stompjs'
import { convertInvalidCharsToUtf8 } from '@utils/Util'

export default function useVisitorSender(
  stompClient: Client,
  wsSendUrl: string,
  visitorId: string,
  publicKeyEncKeyPair: BoxKeyPair,
  hostPublicKey: Uint8Array,
  setCodename: (codename: string) => void
) {
  function sendJoinRequest(codename: string, passphrase: string): void {
    // Some Japanese chars (hankaku-kana and zenkaku-eisu) will fail with encryption
    // this is converting those chars to the same symbolic chars in utf8
    const validUtf8Codename = convertInvalidCharsToUtf8(codename)
    const validUtf8Passphrase = convertInvalidCharsToUtf8(passphrase)

    setCodename(validUtf8Codename)
    const visitorSendingKey = box.before(
      hostPublicKey,
      publicKeyEncKeyPair.secretKey
    )
    const whoIAm: WhoIAm = {
      codename: validUtf8Codename,
      passphrase: validUtf8Passphrase,
    }
    const whoIAmEnc = encrypt(visitorSendingKey, whoIAm)
    const publicKeyString = encodeBase64(publicKeyEncKeyPair.publicKey)
    const joinRequest: JoinRequest = {
      visitorId: visitorId,
      visitorPublicKey: publicKeyString,
      whoIAmEnc,
    }
    if (isInactive(stompClient)) {
      return
    }

    stompClient!.publish({
      destination: wsSendUrl,
      body: JSON.stringify(joinRequest),
    })
  }

  return {
    sendJoinRequest,
  }
}
