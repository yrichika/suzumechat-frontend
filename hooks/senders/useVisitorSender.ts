import { encrypt } from '@hooks/utils/PublicKeyEncryption'
import { sanitizeText } from '@utils/Util'
import { box, BoxKeyPair } from 'tweetnacl'
import WhoIAm from 'types/messages/WhoIAm'
import { encode as encodeBase64 } from '@stablelib/base64'
import JoinRequest from 'types/messages/JoinRequest'
import { isInactive } from '@hooks/stomp/config'
import { Client } from '@stomp/stompjs'

export default function useVisitorSender(
  stompClient: Client,
  wsSendUrl: string,
  visitorId: string,
  publicKeyEncKeyPair: BoxKeyPair,
  hostPublicKey: Uint8Array,
  setCodename: (codename: string) => void
) {
  function sendJoinRequest(codename: string, passphrase: string): void {
    const safeCodename = sanitizeText(codename)
    const safePassphrase = sanitizeText(passphrase)
    setCodename(safeCodename)
    const visitorSendingKey = box.before(
      hostPublicKey,
      publicKeyEncKeyPair.secretKey
    )
    const whoIAm: WhoIAm = {
      codename: safeCodename,
      passphrase: safePassphrase,
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
