import axios from 'axios'

export default async function endChatService(guestChannelToken: string) {
  const url =
    process.env.NEXT_PUBLIC_BACK_PREFIX + '/guest/endChat/' + guestChannelToken
  return await axios.get(url)
}
