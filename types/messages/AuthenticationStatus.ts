// originally: ClientAuthentication
type AuthenticationStatus = {
  isClosed: boolean
  isAuthenticated: boolean | null
  guestId: string
  guestChannelToken: string
  channelName: string
  codename: string
  secretKey: string
}

export default AuthenticationStatus
