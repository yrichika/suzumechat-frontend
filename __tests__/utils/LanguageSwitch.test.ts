import { randomBoolean, randomString } from '@utils/UnsafeRandom'
import { getCookie, setCookie } from '@utils/Cookie'
import {
  cookieKey,
  getLanguageSetting,
  initLanguage,
  getLangMessage,
  setLanguage,
  getBrowserLanguage,
  supportedLangTags,
} from '@utils/LanguageSwitch'
import { randomInt } from 'crypto'

describe('LanguageSwitch', () => {
  const en = new Map([
    ['title', 'title'],
    ['desc', 'description'],
  ])

  const ja = new Map([
    ['title', 'タイトル'],
    ['desc', '説明'],
  ])
  const langMap = new Map([
    ['en', en],
    ['ja', ja],
  ])

  let browserLangMock: jest.SpyInstance

  beforeEach(() => {
    const p1 = document.createElement('p')
    p1.setAttribute('id', 'title')
    p1.dataset.lang = 'title'
    p1.innerText = 'a'
    const p2 = document.createElement('p')
    p2.setAttribute('id', 'desc')
    p2.dataset.lang = 'desc'
    p2.innerText = 'b'
    const wrapper = document.createElement('div')
    wrapper.appendChild(p1)
    wrapper.appendChild(p2)
    document.body.appendChild(wrapper)
    /**
      -- html image --
      <div>
        <p id="title" data-lang="title">a</p>
        <p id="desc" data-lang="desc">b</p>
      </div>
     */

    browserLangMock = jest.spyOn(window.navigator, 'language', 'get')
  })

  afterEach(() => {
    // clear cookie for each test
    document.cookie = `${cookieKey}=; max-age=0; path=/;`
  })

  test('getBrowserLanguage should return supported lang tag string', () => {
    const supported = supportedLangTags[randomInt(1)]
    browserLangMock.mockReturnValue(supported)
    const result = getBrowserLanguage()
    expect(result).toBe(supported)
  })

  test('getBrowserLanguage should return en if browser lang not supported', () => {
    const notSupportedLangTag = randomString(5)
    browserLangMock.mockReturnValue(notSupportedLangTag)
    const result = getBrowserLanguage()
    expect(result).toBe('en')
  })

  test('initLanguage should initialize depends on browser lang setting', () => {
    const supported = supportedLangTags[randomInt(1)]
    browserLangMock.mockReturnValue(supported)
    initLanguage(langMap)
    const lang = langMap.get(supported)
    expect(document.getElementById('title')?.textContent).toBe(
      lang!.get('title')
    )
    expect(document.getElementById('desc')?.textContent).toBe(lang!.get('desc'))
  })

  test('initLanguage should initialize lang as en if browser language is not supported language', () => {
    browserLangMock.mockReturnValue(randomString(5))
    initLanguage(langMap)
    expect(document.getElementById('title')?.textContent).toBe(en.get('title'))
    expect(document.getElementById('desc')?.textContent).toBe(en.get('desc'))
  })

  test.skip('setLanguage should set tags text to specified language', () => {
    setLanguage('ja', langMap)
    expect(document.getElementById('title')?.innerText).toBe(ja.get('title'))
    expect(document.getElementById('desc')?.innerText).toBe(ja.get('desc'))

    setLanguage('en', langMap)
    expect(document.getElementById('title')?.innerText).toBe(en.get('title'))
    expect(document.getElementById('desc')?.innerText).toBe(en.get('desc'))
  })

  test('setLanguage should set cookie language value and document lang to current one', () => {
    setLanguage('ja', langMap)
    expect(getCookie(cookieKey)).toBe('ja')
    expect(document.documentElement.lang).toBe('ja')

    setLanguage('en', langMap)
    expect(getCookie(cookieKey)).toBe('en')
    expect(document.documentElement.lang).toBe('en')
  })

  test('it should get default language if cookie has language value', () => {
    const expectedLang = randomBoolean() ? 'ja' : 'en'
    setCookie(cookieKey, expectedLang)

    const result = getLanguageSetting()
    expect(result).toBe(expectedLang)

    initLanguage(langMap)
    expect(document.documentElement.lang).toBe(expectedLang)
  })

  test('genLangMessage should pick text based on document lang attribute', () => {
    document.documentElement.lang = 'en'
    const resultEn = getLangMessage('title', langMap)
    expect(resultEn).toBe(en.get('title'))

    document.documentElement.lang = 'ja'
    const resultJa = getLangMessage('title', langMap)
    expect(resultJa).toBe(ja.get('title'))
  })

  test('getLangMessage should return empty string if parameters are undefined', () => {
    document.documentElement.lang = randomBoolean() ? 'en' : 'ja'
    const resultEn = getLangMessage('', langMap)
    expect(resultEn).toBe('')
  })

  // TODO:
  test.todo('pickLangMessage should')
})
