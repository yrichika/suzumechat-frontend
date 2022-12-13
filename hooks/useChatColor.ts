import { colors } from '@utils/colors'
import { randomInt } from '@utils/UnsafeRandom'
import { getClearTextColorForBg } from '@utils/Util'
import { useEffect, useState } from 'react'

// FIXME: sent message's user name text is inverse of nameTextColor
export default function useChatColor() {
  const [color] = useState(colors[randomInt(0, 34)])
  const [nameTextColor, setNameTextColor] = useState('text-black')

  useEffect(() => {
    setNameTextColor(getClearTextColorForBg(color))
  }, [])

  return {
    color,
    nameTextColor,
  }
}
