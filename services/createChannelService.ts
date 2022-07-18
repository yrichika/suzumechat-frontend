import useHostStore from '@stores/useHostStore'
import { getCookie, csrfTokenSendKey, csrfTokenSaveKey } from '@utils/Cookie'
import axios from 'axios'
import { NextRouter } from 'next/router'
import CreatedChannel from 'types/CreatedChannel'

export default async function createChannelService(
  channelName: string
): Promise<CreatedChannel | null> {
  const csrfToken = getCookie(csrfTokenSaveKey)

  return await axios
    .post(
      `back/createChannel`,
      { channelName: channelName },
      {
        headers: { [csrfTokenSendKey]: csrfToken },
      }
    )
    .then(response => {
      return response.data as CreatedChannel
    })
    .catch(error => {
      return null
    })
}
