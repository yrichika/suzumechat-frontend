import axios from 'axios'

export default async function endChannelService(hostChannelToken: string) {
  const url =
    process.env.NEXT_PUBLIC_BACK_PREFIX + '/host/endChannel/' + hostChannelToken
  return await axios.post(url)
}
