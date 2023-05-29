export function createStompClientMockForPublish(
  active: boolean,
  stompClientPublishMock: any
): any {
  return {
    active,
    publish: (params: any) => stompClientPublishMock(params),
  }
}
