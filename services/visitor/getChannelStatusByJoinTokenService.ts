import axios from 'axios'
import ChannelStatus from 'types/ChannelStatus'

/**
 * use this function in `getServerSideProps`
 * this function is not using proxy(`process.env.NEXT_PUBLIC_BACK_PREFIX`),
 * instead this uses `process.env.NEXT_PUBLIC_BACK_URL`
 */
export default async function getChannelStatusByJoinTokenService(
  joinChannelToken: string
): Promise<ChannelStatus | null> {
  const url = `${process.env.NEXT_PUBLIC_BACK_URL}/visitor/channelName/${joinChannelToken}`
  return await axios
    .get(url)
    .then(response => {
      return response.data as ChannelStatus
    })
    .catch(error => {
      console.warn(error)
      return null
    })
}
