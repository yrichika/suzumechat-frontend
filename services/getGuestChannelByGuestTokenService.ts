import axios from 'axios'
import GuestChannel from 'types/GuestChannel'

export default async function getGuestChannelByGuestTokenService(
  guestChannelToken: string
): Promise<GuestChannel | null> {
  const url = `${process.env.NEXT_PUBLIC_BACK_URL}/guest/guestChannel/${guestChannelToken}`
  return axios
    .get(url)
    .then(response => {
      return response.data as GuestChannel
    })
    .catch(error => {
      console.warn(error)
      return null
    })
}
