import { colors } from '@utils/colors'
import { randomInt } from '@utils/UnsafeRandom'
import { getClearTextColorForBg } from '@utils/Util'
import { useEffect, useState } from 'react'

export default function useChatColor() {
  const [color, setColor] = useState('')
  const [nameTextColor, setNameTextColor] = useState('text-black')

  useEffect(() => {
    setColor(colors[randomInt(0, 34)])
    setNameTextColor(getClearTextColorForBg(color))
  }, [])

  return {
    color,
    nameTextColor,
  }
}
