// WARNING! the key string might change depending on versions
export const csrfTokenSaveKey = 'XSRF-TOKEN'
export const csrfTokenSendKey = 'X-XSRF-TOKEN'

export function getCookie(key: string): string | null {
  return extractValueFromCookieStringByKey(key, document.cookie)
}

export function setCookie(
  key: string,
  value: string,
  path: string = '/'
): void {
  document.cookie = key + '=' + value + ';path=' + path
}

export function extractValueFromCookieStringByKey(
  key: string,
  cookieString: string
): string | null {
  const r = new RegExp('(^| )' + key + '=([^;]+)')
  const matched = cookieString.match(r)
  if (matched) {
    return matched[2]
  }
  return null
}
