import axios from 'axios'

export default function setGuestSessionService(
  guestId: string,
  guestChannelToken: string
): Promise<boolean> {
  const url = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/guest/setSession/${guestChannelToken}`
  return axios
    .get(url, { params: { guestId } })
    .then(response => {
      return true
    })
    .catch(error => {
      console.warn(error)
      return false
    })
}
