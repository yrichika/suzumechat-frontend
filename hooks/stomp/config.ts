import { IFrame, StompConfig } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

export const stompBasicConfig: StompConfig = {
  connectHeaders: {},
  debug: debug,
  reconnectDelay: 5000, // millisec
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  logRawCommunication: false,
  webSocketFactory: webSocketFactory,
  onStompError: onStompError,
  onDisconnect: onDisconnect,
  onWebSocketClose: onWebSocketClose,
  onWebSocketError: onWebSocketError,
}

const sockJsProtocols = ['xhr-streaming', 'xhr-polling']

function webSocketFactory() {
  return new SockJS(
    `${process.env.NEXT_PUBLIC_BACK_PREFIX}/${process.env.NEXT_PUBLIC_WS_CHAT_ENDPOINT}`,
    null,
    {
      transports: sockJsProtocols,
    }
  )
}
function debug(message: string) {
  // use when debugging
}
function onStompError(frame: IFrame) {
  // TODO:
  console.log('Stomp Error', frame)
}
function onDisconnect(frame: IFrame) {
  // TODO:
  console.log('Stomp Disconnected', frame)
}
function onWebSocketClose(frame: IFrame) {
  // TODO:
  console.log('Stomp WebSocket Closed', frame)
}
function onWebSocketError(frame: IFrame) {
  // TODO:
  console.log('Stomp WebSocket Error', frame)
}
