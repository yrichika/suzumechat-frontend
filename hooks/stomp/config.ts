import { Client, frameCallbackType, IFrame, StompConfig } from '@stomp/stompjs'
import { Dispatch, SetStateAction } from 'react'
import SockJS from 'sockjs-client'

export function connect(
  setStompClient: Dispatch<SetStateAction<Client | undefined>>,
  onConnect: (stompClient: Client) => frameCallbackType | undefined,
  url: string
) {
  const stompClient = new Client()
  stompClient.configure({
    ...stompBasicConfig,
    webSocketFactory: webSocketFactory(url),
    onConnect: onConnect(stompClient),
  })
  stompClient.activate()
  setStompClient(stompClient)
}

export function isActive(stompClient: Client | undefined) {
  return stompClient && stompClient.active
}

export function isInactive(stompClient: Client | undefined) {
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

const sockJsProtocols = ['xhr-streaming', 'xhr-polling']

export function webSocketFactory(url: string) {
  return () =>
    new SockJS(url, null, {
      transports: sockJsProtocols,
    })
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
