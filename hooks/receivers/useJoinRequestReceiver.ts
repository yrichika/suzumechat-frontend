import JoinRequest from 'types/messages/JoinRequest'
import ManageableJoinRequest from 'types/messages/ManageableJoinRequest'
import { box } from 'tweetnacl'
import { decode as decodeBase64 } from '@stablelib/base64'
import useHostStore from '@stores/useHostStore'
import { decrypt } from '@hooks/utils/PublicKeyEncryption'
import WhoIAm from 'types/messages/WhoIAm'

export default function useJoinRequestReceiver(
  addManageableJoinRequest: (newRequest: ManageableJoinRequest) => void,
  hostSecretKey: Uint8Array
) {
  function receiveJoinRequest(joinRequest: JoinRequest) {
    const visitorPublicKey = decodeBase64(joinRequest.visitorPublicKey)
    const hostReceivingKey = box.before(visitorPublicKey, hostSecretKey)
    const whoIAm = decrypt(hostReceivingKey, joinRequest.whoIAmEnc) as WhoIAm
    const manageableJoinRequest: ManageableJoinRequest = {
      visitorId: joinRequest.visitorId,
      codename: whoIAm.codename,
      passphrase: whoIAm.passphrase,
      publicKey: visitorPublicKey,
      isAuthenticated: null,
    }

    addManageableJoinRequest(manageableJoinRequest)
  }
  return {
    receiveJoinRequest,
  }
}
