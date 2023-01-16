import useChatColor from '@hooks/common/components/useChatColor'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import { renderHook, act } from '@testing-library/react'

describe('useChatColor', () => {
  test('color should be selected from tailwind colors in the color constant', () => {
    const { result } = renderHook(() => useChatColor())
    expect(result.current.color).toMatch(/\w+-[23456]00/)
  })
})
