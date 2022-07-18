import useHostStore from '@stores/useHostStore'
import React from 'react'

function HostChannel() {
  // these are constant values, not reactive
  const channelName = useHostStore.getState().channelName
  const loginChannelToken = useHostStore.getState().loginChannelToken
  const secretKey = useHostStore.getState().secretKey
  // TODO: hostのチャットページ
  return (
    <>
      <div>channelName: {channelName}</div>
      <div>loginChannelToken: {loginChannelToken}</div>
      <div>secreteKey: {secretKey}</div>
    </>
  )
}

export default HostChannel
