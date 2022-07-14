import { getCookie, setCookie } from './Cookie'

export const cookieKey: string = 'FAKE_LANG' // TODO: Spring Boot, Nextjsの仕様と合わせる

export const langAttribute: string = 'data-lang'
export const langSelector: string = '[' + langAttribute + ']'

export function getLanguageSetting(): string {
  return getCookie(cookieKey) || document.documentElement.lang
}

export function setLanguage(
  toThisLang: string,
  langMap: Map<string, Map<string, string>>
): void {
  const currentLanguage = langMap.get(toThisLang)
  if (!currentLanguage) {
    return
  }
  setCookie(cookieKey, toThisLang)
  document.documentElement.lang = toThisLang
  const langSockets = document.querySelectorAll(langSelector)
  langSockets.forEach((lang) => {
    const key = lang.getAttribute(langAttribute)
    if (key) {
      const message = currentLanguage.get(key)
      if (message) {
        lang.textContent = message
      }
    }
  })
}

export function initLanguage(langMap: Map<string, Map<string, string>>): void {
  const defaultLang = getLanguageSetting()
  setLanguage(defaultLang, langMap)
}

// originally `pickLangMessage`
export function getLangMessage(
  messageKey: string,
  langMap: Map<string, Map<string, string>>
): string {
  const langSetting = getLanguageSetting()
  const currentLanguage = langMap.get(langSetting)
  if (currentLanguage) {
    return currentLanguage.get(messageKey) ?? ''
  }
  return ''
}
