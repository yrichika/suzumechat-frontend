import { getCookie, csrfTokenSendKey, csrfTokenSaveKey } from '@utils/Cookie'
import axios from 'axios'
import { NextRouter } from 'next/router'
import CreatedChannel from 'types/CreatedChannel'

export default async function createChannelService(
  channelName: string,
  router: NextRouter
) {
  const redirectTo = '/host/view'
  const csrfToken = getCookie(csrfTokenSaveKey)
  axios
    .post(
      `back/createChannel`,
      { channelName: channelName },
      { headers: { [csrfTokenSendKey]: csrfToken } }
    )
    .then(response => {
      console.log(response.data)
      // const hostChannelToken = response.data as CreatedChannel
      // const hostChannelToken = 'fake'
      // TODO: storesに保存と、localStorageにも保存すること
      // router.push(`${redirectTo}/${hostChannelToken}`)
    })
    .catch(error => {
      // TODO: バリデーションエラーを表示させる
      console.log(error)
    })
}
