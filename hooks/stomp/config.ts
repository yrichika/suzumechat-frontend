import { Client, frameCallbackType, IFrame, StompConfig } from '@stomp/stompjs'
import { Dispatch, SetStateAction } from 'react'
import SockJS from 'sockjs-client'

const WS_ENDPOINT_URL = `${process.env.NEXT_PUBLIC_BACK_PREFIX}${process.env.NEXT_PUBLIC_WS_ENDPOINT}`
const sockJsProtocols = ['xhr-streaming', 'xhr-polling']

export function connect(
  stompClient: Client,
  onConnect: (stompClient: Client) => frameCallbackType | undefined
) {
  stompClient.configure({
    ...stompBasicConfig,
    webSocketFactory: webSocketFactory(WS_ENDPOINT_URL),
    onConnect: onConnect(stompClient),
  })
  stompClient.activate()
}

// DELETE: stompClientがundefinedやnullになることはないので、不要になった。
// 後で削除すること
export function isActive(stompClient: Client | undefined | null) {
  return stompClient && stompClient.active
}
// DELETE:
export function isInactive(stompClient: Client | undefined | null) {
  return !isActive(stompClient)
}

export const stompBasicConfig: StompConfig = {
  connectHeaders: {},
  debug: debug,
  reconnectDelay: 5000, // millisec
  heartbeatIncoming: 10000,
  heartbeatOutgoing: 10000,
  logRawCommunication: false,
  onStompError: onStompError,
  onDisconnect: onDisconnect,
  onWebSocketClose: onWebSocketClose,
  onWebSocketError: onWebSocketError,
}

export function webSocketFactory(url: string) {
  return () =>
    new SockJS(url, null, {
      transports: sockJsProtocols,
    })
}
function debug(message: string) {
  // use `yarn wsdebug` to output this message
  if (process.env.NEXT_PUBLIC_WS_DEBUG) {
    console.log(message)
  }
}
function onStompError(frame: IFrame) {
  // TODO:
  console.warn('Stomp Error', frame)
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
  console.warn('Stomp WebSocket Error', frame)
}
