import axios from 'axios'
import JoinRequest from 'types/JoinRequest'

export default async function joinRequestService(
  joinChannelToken: string,
  joinRequest: JoinRequest
): Promise<any> {
  const url = `${process.env.NEXT_PUBLIC_BACK_PREFIX}/visitor/joinRequest/${joinChannelToken}`
  return axios.post(url, joinRequest)
}
