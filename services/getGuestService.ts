import axios from 'axios'
import GuestDto from 'types/GuestDto'

// DELETE:
export default function getGuestService(
  guestId: string,
  guestChannelToken: string
): Promise<GuestDto | null> {
  const url = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/guest/guestDto/${guestChannelToken}`
  return axios
    .get(url, { params: { guestId } })
    .then(response => {
      const guestDto = response.data as GuestDto
      return guestDto
    })
    .catch(error => {
      console.warn(error)
      return null
    })
}
