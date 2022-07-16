import { getCookie } from '@utils/Cookie'
import axios from 'axios'
import { NextRouter } from 'next/router'

interface CreatedChannel {
  hostChannelToken: string
}

export default async function createChannelService(
  channelName: string,
  router: NextRouter
) {
  const redirectTo = '/host/view'
  axios
    .post('api/createChannel', { channelName: channelName })
    .then(results => {
      // const hostChannelToken = results.
      const hostChannelToken = 'fake'
      // TODO: storesに保存と、localStorageにも保存すること
      router.push(`${redirectTo}/${hostChannelToken}`)
    })
    .catch(error => {
      // TODO: バリデーションエラーを表示させる
      console.log(error)
    })
}
