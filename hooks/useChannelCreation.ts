import createChannelService from '@services/createChannelService'
import csrfTokenService from '@services/csrfTokenService'
import useHostStore from '@stores/useHostStore'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import HostChannel from 'types/HostChannel'

export default function useChannelCreation() {
  const [channelNameInput, setChannelNameInput] = useState('')
  const router = useRouter()

  const setChannelName = useHostStore(state => state.setChannelName)
  const setSecretKey = useHostStore(state => state.setSecretKey)
  const setJoinChannelToken = useHostStore(state => state.setJoinChannelToken)

  useEffect(() => {
    csrfTokenService()
  }, [])

  function postChannelName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    createChannelService(channelNameInput).then(
      (hostChannel: HostChannel | null) => {
        if (!hostChannel) {
          // just ignoring is fine for now. Usually it's validation error from backend
          return
        }
        setChannelName(channelNameInput)
        setJoinChannelToken(hostChannel.joinChannelToken)
        setSecretKey(hostChannel.secretKey)

        const redirectTo = '/host'
        router.push(`${redirectTo}/${hostChannel.hostChannelToken}`)
      }
    )
  }

  return {
    postChannelName,
    channelNameInput,
    setChannelNameInput,
  }
}