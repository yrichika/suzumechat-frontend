export function hasAllPropertiesOf(
  object: any,
  propertyNames: string[]
): boolean {
  return !propertyNames
    .map(propertyName => object.hasOwnProperty(propertyName))
    .includes(false)
}

export function isChatMessageCapsuleMessage(
  maybeChatMessageCapsule: any
): boolean {
  const propertyNames = ['encryptedMessage']
  return hasAllPropertiesOf(maybeChatMessageCapsule, propertyNames)
}

export function isManagedJoinRequestMessage(
  maybeManagedJoinRequest: any
): boolean {
  const propertyNames = [
    'visitorId',
    'codename',
    'passphrase',
    'isAuthenticated',
  ]
  return hasAllPropertiesOf(maybeManagedJoinRequest, propertyNames)
}

export function isJoinRequestMessage(maybeJoinRequest: any): boolean {
  const propertyNames = ['visitorId', 'codename', 'passphrase']
  return hasAllPropertiesOf(maybeJoinRequest, propertyNames)
}

export function isAuthenticationStatus(
  maybeAuthenticationStatus: any
): boolean {
  const propertyNames = [
    'isClosed',
    'isAuthenticated',
    'guestId',
    'guestChannelToken',
  ]
  return hasAllPropertiesOf(maybeAuthenticationStatus, propertyNames)
}

export function isTerminateMessage(maybeTerminate: any): boolean {
  const propertyNames = ['terminatedBy', 'message', 'data']
  return hasAllPropertiesOf(maybeTerminate, propertyNames)
}

export function isError(maybeError: any): boolean {
  const propertyNames = ['isError', 'type']
  return hasAllPropertiesOf(maybeError, propertyNames)
}
