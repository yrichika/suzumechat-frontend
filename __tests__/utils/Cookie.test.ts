import { randomString } from '@testhelpers/Random'
import { setCookie, getCookie } from '@utils/Cookie'

/**
 * Cookie class functionality depends on browsers.
 * Note that this test is not really testing how it behaves on browsers.
 * This test is treating `document.cookie` as just a string variable.
 * `setCookie` appends string with `=` operator on actual browsers.
 * But this test `document.cookie` overrides string like usual variables.
 */
describe('Cookie', () => {
  const cookieKey: string = 'test'
  const cookieValue: string = randomString(10)
  Object.defineProperty(window.document, 'cookie', {
    writable: true,
    value: '',
  })

  beforeEach(() => {
    document.cookie = cookieKey + '=' + cookieValue
  })

  test('getCookie should get an item from selected key', () => {
    expect(getCookie(cookieKey)).toBe(cookieValue)
  })

  /**
   * This test is not really working.
   * This test overwrites the existing cookie.
   * But it does not overwrite when running on browser.
   */
  test('setCookie should be able to set a cookie', () => {
    const key = randomString(5)
    const value = randomString(10)
    setCookie(key, value)

    expect(getCookie(key)).toBe(value)
    // It should still get another item. This code should work fine on browser, but not in test.
    // expect(Cookie.get(cookieKey)).toBe(cookieValue)
  })

  test('setCookie should set default cookie path to root', () => {
    const key = randomString(5)
    const value = randomString(10)
    setCookie(key, value)

    expect(document.cookie).toMatch(new RegExp('path=/'))
  })

  test('setCookie should set cookie path if specified', () => {
    const key = randomString(5)
    const value = randomString(10)
    const path = '/fake-path'
    setCookie(key, value, path)

    expect(document.cookie).toMatch(new RegExp(`path=${path}`))
  })
})
