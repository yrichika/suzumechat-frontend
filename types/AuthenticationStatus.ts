// originally: ClientAuthentication
type AuthenticationStatus = {
  isClosed: boolean
  isAuthenticated: boolean | null
  guestChannelToken: string
}

export default AuthenticationStatus
