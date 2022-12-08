type ChannelStatus = {
  channelName: string
  hostPublicKey: string | null // Optional
  isAccepting: boolean
}

export default ChannelStatus
