// originally: ClientAuthentication
type AuthenticationStatus = {
  isClosed: boolean
  isAuthenticated: boolean | null
  guestId: string
  guestChannelToken: string
  channelName: string // DELETE: maybe not necessary. visitor can get channelName simpler way.
  secretKey: string
}

export default AuthenticationStatus
