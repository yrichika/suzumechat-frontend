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
  // TODO: CSRF token is always invalid.
  // const csrfToken = getCookie('XSRF-TOKEN')
  // if (!csrfToken) {
  //   console.log('csrfToken is empty.')
  //   return
  // }
  axios
    .post('http://localhost:8080/create', { channelName: channelName })
    .then((results) => {
      // const hostChannelToken = results.
      const hostChannelToken = 'fake'
      // TODO: storesに保存と、localStorageにも保存すること
      router.push(`${redirectTo}/${hostChannelToken}`)
    })
    .catch((error) => {
      // TODO: バリデーションエラーを表示させる
      console.log(error)
    })
}
