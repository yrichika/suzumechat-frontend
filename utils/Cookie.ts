export function getCookie(key: string): string | null {
  const match = document.cookie.match(new RegExp('(^|)' + key + '=([^;]+)'))
  if (match) {
    return match[2]
  }
  return null
}

export function setCookie(
  key: string,
  value: string,
  path: string = '/'
): void {
  document.cookie = key + '=' + value + ';path=' + path
}
