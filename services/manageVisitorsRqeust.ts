import axios from 'axios'
import VisitorsAuthStatus from 'types/VisitorsAuthStatus'

export default async function manageVisitorsRequest(
  hostChannelToken: string,
  visitorsAuthStatus: VisitorsAuthStatus
): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/host/manageVisitorsRequest/${hostChannelToken}`
  // TODO: まだ途中
  return await axios.post(url, visitorsAuthStatus)
}
