// originally: ClientAuthentication
type AuthenticationStatus = {
  isClosed: boolean
  isAuthenticated: boolean | null
  guestId: string
  guestChannelToken: string
}

export default AuthenticationStatus
