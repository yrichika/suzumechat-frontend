import useHostStore from '@stores/useHostStore'
import { getCookie, csrfTokenSendKey, csrfTokenSaveKey } from '@utils/Cookie'
import axios from 'axios'
import { NextRouter } from 'next/router'
import HostChannel from 'types/HostChannel'

export default async function createChannelService(
  channelName: string,
  publicKey: string
): Promise<HostChannel | null> {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BACK_PREFIX}/createChannel`, {
      channelName,
      publicKey,
    })
    .then(response => {
      return response.data as HostChannel
    })
    .catch(error => {
      return null // TODO: エラー時の処理
    })
}
