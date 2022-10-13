import { getCookie, setCookie } from './Cookie'

export const cookieKey = 'LANG'

export const langAttribute = 'data-lang'
export const langSelector = '[' + langAttribute + ']'
export const supportedLangTags = ['en', 'ja']

export function getBrowserLanguage(): string {
  return supportedLangTags.includes(navigator.language)
    ? navigator.language
    : 'en'
}

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
  langSockets.forEach(lang => {
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
  document.documentElement.lang = getBrowserLanguage()
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

// TEST:
export function pickLangMessage(
  key: string,
  langMap: Map<string, Map<string, string>>
): string {
  const docLang = document.documentElement.lang
  const messages = langMap.get(docLang)
  if (!messages) {
    return ''
  }
  return messages.get(key) ?? ''
}
