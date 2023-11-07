import useChannelCreation from '@hooks/index/pages/useChannelCreation'
import React from 'react'

jest.mock('@stores/host/useHostStore', () =>
  jest.fn((stateCallback: (state: any) => any) => {
    const stateMock = {
      setChannelName: jest.fn((channelName: string) => {}),
      setSecretKey: jest.fn((secretKey: string) => {}),
      setJoinChannelToken: jest.fn((joinChannelToken: string) => {}),
      publicKeyEncKeyPair: {
        publicKey: new Uint8Array(),
        secretKey: new Uint8Array(),
      },
      initPublicKeyEncKeyPair: jest.fn(() => {}),
    }
    return stateCallback(stateMock)
  })
)

const routerPushMock = jest.fn()
jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: (redirectTo: string) => routerPushMock(redirectTo),
    }
  },
}))

const csrfTokenServiceMock = jest.fn(() => {})
jest.mock('@services/csrfTokenService', () => csrfTokenServiceMock)

describe('useChannelCreation', () => {
  const useStateMock = (useState: any) => [useState, jest.fn()]
  jest.spyOn(React, 'useState').mockImplementation(useStateMock as any)

  beforeEach(() => {
    //
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('postChannelName should ', () => {
    const event: any = {
      preventDefault: jest.fn(),
    }
    const { postChannelName } = useChannelCreation()

    postChannelName(event)
    // WORKING: まだmockも全部必要なものを作ったか不明
    // アサーションを作っていくこと
  })
})
