import {
  breakLines,
  copyToClipboard,
  disableButtons,
  hideTips,
  sanitizeText,
  isAnyOfEmpty,
  isEmpty,
  toggleVisibilityBySelector,
  getClearTextColorForBg,
  convertInvalidCharsToUtf8,
} from '@utils/Util'
import { randomInt, randomProperty, randomString } from '@utils/UnsafeRandom'
import { expect } from '@jest/globals'
import { hanToZenKatakanaMap, zenToHanEisuMap } from '@utils/LangSupport'
import { TailwindColor } from 'types/TailwindColor'

describe('Utils', () => {
  let docBaseElement: HTMLDivElement
  /**
   * image of html tags
   * <body>
   *   <div>
   *     <any-testing-element></any-testing-element>
   *   </div>
   * </body>
   */
  beforeEach(() => {
    document.body.innerHTML = ''
    docBaseElement = document.createElement('div')
    docBaseElement.setAttribute('id', 'main')
    document.body.appendChild(docBaseElement)
  })

  test('isEmpty should return true if value null', () => {
    const values = [null, undefined, '', []]
    values.forEach(value => {
      const result = isEmpty(value)
      expect(result).toBe(true)
    })
  })

  test('isAnyOfEmpty should return true if any of the values is empty values', () => {
    // TODO: make test with random values and random empty values
    const result = isAnyOfEmpty('a', '')
    expect(result).toBe(true)

    const result2 = isAnyOfEmpty('a', undefined, 'b')
    expect(result2).toBe(true)

    const result3 = isAnyOfEmpty('a', [], 'b')
    expect(result3).toBe(true)

    const result4 = isAnyOfEmpty('a', 'b', null)
    expect(result4).toBe(true)
  })

  test.todo('isNotEmpty')

  test.todo('isAnyOfNotEmpty')

  test('copyToClipboard should copy selected text to clipboard', () => {
    document.execCommand = jest.fn()

    const inputText = document.createElement('input')
    const copyFieldTagId = randomString(5)
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('id', copyFieldTagId)
    docBaseElement.appendChild(inputText)
    const copyField = document.getElementById(
      copyFieldTagId
    ) as HTMLInputElement
    copyField.value = randomString(5)

    copyToClipboard(copyFieldTagId)

    expect(document.execCommand).toHaveBeenCalledWith('copy')
  })

  test('copyToClipboard should not call execCommand for copy if not the right tag id', () => {
    document.execCommand = jest.fn()

    const inputText = document.createElement('input')
    const copyFieldTagId = randomString(5)
    inputText.setAttribute('type', 'text')
    inputText.setAttribute('id', copyFieldTagId)
    docBaseElement.appendChild(inputText)
    const copyField = document.getElementById(
      copyFieldTagId
    ) as HTMLInputElement
    copyField.value = randomString(5)

    const wrongTagId = randomString(6)

    copyToClipboard(wrongTagId)

    expect(document.execCommand).not.toHaveBeenCalledWith('copy')
  })

  test('breakLines should replace line feed code to br tag', () => {
    const result1 = breakLines('aaa\nbbb')
    expect(result1).toMatch('aaa<br>bbb')

    const result2 = breakLines('aaa\rbbb')
    expect(result2).toMatch('aaa<br>bbb')

    const resultWin = breakLines('aaa\r\nbbb')
    expect(resultWin).toMatch('aaa<br>bbb')
  })

  test('sanitizeText should convert & to &amp; within text', () => {
    const input = 'abc&abc'
    const expected = 'abc&amp;abc'
    const result = sanitizeText(input)
    expect(result).toBe(expected)
  })

  test('sanitizeText should convert " to &quot; within text', () => {
    const input = 'abc"abc'
    const expected = 'abc&quot;abc'
    const result = sanitizeText(input)
    expect(result).toBe(expected)
  })

  test("sanitizeText should convert ' to &apos; within text", () => {
    const input = "abc'abc"
    const expected = 'abc&apos;abc'
    const result = sanitizeText(input)
    expect(result).toBe(expected)
  })

  test('sanitizeText should convert < to &lt; within text', () => {
    const input = 'abc<abc'
    const expected = 'abc&lt;abc'
    const result = sanitizeText(input)
    expect(result).toBe(expected)
  })

  test('sanitizeText should convert > to &gt; within text', () => {
    const input = 'abc>abc'
    const expected = 'abc&gt;abc'
    const result = sanitizeText(input)
    expect(result).toBe(expected)
  })

  test('sanitizeText should convert multiple special chars at once', () => {
    const input = 'abc<>abc'
    const expected = 'abc&lt;&gt;abc'
    const result = sanitizeText(input)
    expect(result).toBe(expected)
  })

  test('disableButtons should disable sequential buttons with prefixes', () => {
    const buttonA1 = document.createElement('button') as HTMLButtonElement
    buttonA1.setAttribute('id', 'test-a-1')
    const buttonA2 = document.createElement('button') as HTMLButtonElement
    buttonA2.setAttribute('id', 'test-a-2')
    const buttonB1 = document.createElement('button') as HTMLButtonElement
    buttonB1.setAttribute('id', 'test-b-1')
    const buttonB2 = document.createElement('button') as HTMLButtonElement
    buttonB2.setAttribute('id', 'test-b-2')

    docBaseElement.appendChild(buttonA1)
    docBaseElement.appendChild(buttonA2)
    docBaseElement.appendChild(buttonB1)
    docBaseElement.appendChild(buttonB2)

    for (let index = 1; index <= 2; index++) {
      disableButtons(index, ['test-a-', 'test-b-'])
    }

    expect(buttonA1.disabled).toBeTruthy()
    expect(buttonA2.disabled).toBeTruthy()
    expect(buttonB1.disabled).toBeTruthy()
    expect(buttonB2.disabled).toBeTruthy()
  })

  test('hideTips should hide all tips with specified selector', () => {
    const className = 'tip'
    const selector = '.' + className
    const p1 = document.createElement('p') as HTMLParagraphElement
    p1.setAttribute('class', className)
    const p2 = document.createElement('p') as HTMLParagraphElement
    p2.setAttribute('class', className)
    docBaseElement.appendChild(p1)
    docBaseElement.appendChild(p2)

    hideTips(selector)

    expect(p1.style.display).toBe('none')
    expect(p2.style.display).toBe('none')
  })

  test('toggleVisibilityBySelector should toggle css display none property', () => {
    const className = 'tip'
    const selector = '.' + className
    const p1 = document.createElement('p') as HTMLParagraphElement
    p1.setAttribute('class', className)
    const p2 = document.createElement('p') as HTMLParagraphElement
    p2.setAttribute('class', className)
    const paragraphElements = [p1, p2]
    paragraphElements.forEach(paragraph =>
      docBaseElement.appendChild(paragraph)
    )

    const eventStub: any = {
      preventDefault: jest.fn(),
    }

    toggleVisibilityBySelector(eventStub, selector)

    paragraphElements.forEach(paragraph => {
      expect(paragraph.style.display).toBe('none')
    })

    toggleVisibilityBySelector(eventStub, selector)

    paragraphElements.forEach(paragraph => {
      expect(paragraph.style.display).toBe('')
    })
  })

  test('getClearTextColorForBg should return text-white if given background color is dark', () => {
    const color = (randomString() +
      randomInt(5, 9).toString() +
      '00') as TailwindColor

    const result = getClearTextColorForBg(color)
    expect(result).toBe('text-white')
  })

  test('getClearTextColorForBg should return text-black if given background color is light', () => {
    const color = (randomString() +
      randomInt(2, 4).toString() +
      '00') as TailwindColor

    const result = getClearTextColorForBg(color)
    expect(result).toBe('text-black')
  })

  test('convertInvalidCharsToUtf8 should convert invalid chars like han-katakana to valid utf8 chars', () => {
    const kanaEisuMap = Object.assign(hanToZenKatakanaMap, zenToHanEisuMap)

    let randomKanaEisu = {}
    for (let i = 0; i < randomInt(3, 10); i++) {
      randomKanaEisu = { ...randomKanaEisu, ...randomProperty(kanaEisuMap) }
    }
    const randomInvalidChars = Object.keys(randomKanaEisu).join('')
    const expected = Object.values(randomKanaEisu).join('')

    const result = convertInvalidCharsToUtf8(randomInvalidChars)

    expect(result).toBe(expected)
  })

  test('convertInvalidCharsToUtf8 should not convert valid utf8 chars and just output as input', () => {
    const randomUtf8String = randomString(randomInt(3, 10))
    const result = convertInvalidCharsToUtf8(randomUtf8String)

    expect(result).toBe(randomUtf8String)
  })
})
