import axios from 'axios'

export default async function closeJoinRequestService(
  hostChannelToken: string
): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/host/closeJoinRequest/${hostChannelToken}`
  return await axios.get(url)
}
