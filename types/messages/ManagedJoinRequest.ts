import JoinRequest from './JoinRequest'

// originally ClientRequest
export default interface ManagedJoinRequest extends JoinRequest {
  isAuthenticated: boolean | null
}
