import createChannelService from '@services/createChannelService'
import csrfTokenService from '@services/csrfTokenService'
import useHostStore from '@stores/host/useHostStore'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import HostChannel from 'types/HostChannel'
import { encode as encodeBase64 } from '@stablelib/base64'

export default function useChannelCreation() {
  const [channelNameInput, setChannelNameInput] = useState('')
  const router = useRouter()

  const setChannelName = useHostStore(state => state.setChannelName)
  const setSecretKey = useHostStore(state => state.setSecretKey)
  const setJoinChannelToken = useHostStore(state => state.setJoinChannelToken)
  const publicKey = useHostStore(state => state.publicKeyEncKeyPair.publicKey)
  const initPublicKeyEncKeyPair = useHostStore(
    state => state.initPublicKeyEncKeyPair
  )

  useEffect(() => {
    sessionStorage.clear()

    // setting necessary data for host
    csrfTokenService()
    initPublicKeyEncKeyPair()
  }, [])

  function postChannelName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const publicKeyString = encodeBase64(publicKey)
    createChannelService(channelNameInput, publicKeyString).then(
      (hostChannel: HostChannel | null) => {
        if (!hostChannel) {
          // just ignoring is fine for now. Usually it's validation error from backend
          return
        }
        setChannelName(channelNameInput)
        setJoinChannelToken(hostChannel.joinChannelToken)
        setSecretKey(hostChannel.secretKey)

        const redirectTo = '/host/chat/'
        router.push(`${redirectTo}${hostChannel.hostChannelToken}`)
      }
    )
  }

  return {
    postChannelName,
    channelNameInput,
    setChannelNameInput,
  }
}
