import useHostStore from '@stores/useHostStore'
import { randomInt, randomString } from '@utils/UnsafeRandom'
import { renderHook, act } from '@testing-library/react'

describe('useHostStore', () => {
  beforeEach(() => {
    //
  })

  test('just tinkering store tests, not important', () => {
    const input = randomString()
    const { result } = renderHook(() => useHostStore())
    act(() => {
      result.current.setChannelName(input)
    })

    expect(result.current.channelName).toBe(input)
  })
})
