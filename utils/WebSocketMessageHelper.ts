export function hasAllPropertiesOf(
  object: any,
  propertyNames: string[]
): boolean {
  return !propertyNames
    .map(propertyName => object.hasOwnProperty(propertyName))
    .includes(false)
}

export function isChatMessageCapsule(maybeChatMessageCapsule: any): boolean {
  const propertyNames = ['encryptedMessage']
  return hasAllPropertiesOf(maybeChatMessageCapsule, propertyNames)
}

export function isJoinRequest(maybeJoinRequest: any): boolean {
  const propertyNames = ['visitorId', 'visitorPublicKey', 'whoIAmEnc']
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
    'channelName',
    'secretKey',
  ]
  return hasAllPropertiesOf(maybeAuthenticationStatus, propertyNames)
}

export function isJoinRequestClosed(maybeJoinRequestClosed: any): boolean {
  const propertyName = ['isJoinRequestClosed']
  return hasAllPropertiesOf(maybeJoinRequestClosed, propertyName)
}

export function isTerminate(maybeTerminate: any): boolean {
  const propertyNames = ['terminatedBy', 'message', 'data']
  return hasAllPropertiesOf(maybeTerminate, propertyNames)
}

export function isErrorMessage(maybeError: any): boolean {
  const propertyNames = ['isError', 'type']
  return hasAllPropertiesOf(maybeError, propertyNames)
}
