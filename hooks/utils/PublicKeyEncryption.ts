// REFERENCE: https://github.com/dchest/tweetnacl-js/wiki/Examples#box
import { box, BoxKeyPair, randomBytes } from 'tweetnacl'
import {
  encode as encodeBase64,
  decode as decodeBase64,
} from '@stablelib/base64'
import { encode as encodeUTF8, decode as decodeUTF8 } from '@stablelib/utf8'

export function encrypt(
  secretOrSharedKey: Uint8Array,
  json: any,
  key?: Uint8Array
): string {
  const nonce = newNonce()
  const messageUint8 = encodeUTF8(JSON.stringify(json))
  const encrypted = key
    ? box(messageUint8, nonce, key, secretOrSharedKey)
    : box.after(messageUint8, nonce, secretOrSharedKey)

  const fullMessage = new Uint8Array(nonce.length + encrypted.length)
  fullMessage.set(nonce)
  fullMessage.set(encrypted, nonce.length)

  const base64FullMessage = encodeBase64(fullMessage)
  return base64FullMessage
}

export function decrypt(
  secretOrSharedKey: Uint8Array,
  messageWithNonce: string,
  key?: Uint8Array
): any {
  const messageWithNonceAsUint8Array = decodeBase64(messageWithNonce)
  const nonce = messageWithNonceAsUint8Array.slice(0, box.nonceLength)
  const message = messageWithNonceAsUint8Array.slice(
    box.nonceLength,
    messageWithNonce.length
  )

  const decrypted = key
    ? box.open(message, nonce, key, secretOrSharedKey)
    : box.open.after(message, nonce, secretOrSharedKey)

  if (!decrypted) {
    throw new Error('Public key encryption error: could not decrypt message')
  }

  const base64DecryptedMessage = decodeUTF8(decrypted)
  return JSON.parse(base64DecryptedMessage)
}

export function generateKeyPair(): BoxKeyPair {
  return box.keyPair()
}

function newNonce(): Uint8Array {
  return randomBytes(box.nonceLength)
}
