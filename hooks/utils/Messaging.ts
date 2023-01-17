export function handleWithMatchedHandler(
  messageBody: any,
  messageHandlers: Map<(message: any) => boolean, (message: any) => void>
) {
  let isNotHandled = true
  messageHandlers.forEach((handleMessage, canHandle) => {
    if (isNotHandled && canHandle(messageBody)) {
      handleMessage(messageBody)
      isNotHandled = false
    }
  })
  if (isNotHandled) {
    // TODO: unable to handle: display error notification on screen
    console.warn('Message not handled.', messageBody)
  }
}
