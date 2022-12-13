import csrfTokenService from '@services/csrfTokenService'
import { setCookie, getCookie } from '@utils/Cookie'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import axios from 'axios'
import SpringBootCsrfTokenResponseBody from 'types/SpringBootCsrfTokenResponseBody'
import { Mock } from '_testhelpers/types/Mock'

jest.mock('axios')
jest.mock('@utils/Cookie', () => ({
  setCookie: jest.fn(),
  getCookie: jest.fn().mockReturnValue(null),
}))

describe('csrfTokenService', () => {
  const response = {
    data: {
      token: randomString(),
      parameterName: randomString(),
      headerName: randomString(),
    } as SpringBootCsrfTokenResponseBody,
  }
  beforeEach(() => {
    //
  })
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('it should set cookie if cookie not fetched yet', async () => {
    ;(axios.get as Mock).mockResolvedValueOnce(Promise.resolve(response))

    await csrfTokenService()
    expect(axios.get).toHaveBeenNthCalledWith(
      1,
      `${process.env.NEXT_PUBLIC_BACK_PREFIX}/csrfToken`
    )
    expect(setCookie).toHaveBeenNthCalledWith(
      1,
      response.data.headerName,
      response.data.token
    )
  })

  test('it should not call axios.get if already has csrf token in cookie', async () => {
    ;(getCookie as Mock).mockImplementation(() => randomString())

    await csrfTokenService()
    expect(axios.get).not.toHaveBeenCalled()
  })

  // TODO: not sure how to test axios catch
  test.skip('it should call console.warn if error', async () => {
    ;(axios.get as Mock).mockRejectedValueOnce(() =>
      Promise.reject(new Error())
    )

    jest.spyOn(global.console, 'warn')
    await csrfTokenService()

    expect(global.console.warn).toHaveBeenCalledTimes(1)
  })
})
