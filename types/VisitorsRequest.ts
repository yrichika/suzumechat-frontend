// originally ClientRequest
export default interface VisitorsRequest {
  visitorId: string
  codename: string
  passphrase: string
  isAuthenticated: boolean | null
}
