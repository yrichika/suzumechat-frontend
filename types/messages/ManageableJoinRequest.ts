export default interface ManageableJoinRequest {
  visitorId: string
  codename: string
  passphrase: string
  publicKey: Uint8Array
  isAuthenticated: boolean | null
  isSendable: boolean
}
