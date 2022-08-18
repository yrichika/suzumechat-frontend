import axios from 'axios'

export default async function closeVisitorsRequests(
  hostChannelToken: string
): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/host/closeVisitorsRequests/${hostChannelToken}`
  return await axios.get(url)
}
