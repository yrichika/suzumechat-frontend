import Public from '@components/common/templates/Public'
import { langMap } from '@lang/host/channelEnded/langMap'

function ChannelEnded() {
  const topPageUrl = process.env.NEXT_PUBLIC_FRONT_URL

  return (
    <Public langMap={langMap}>
      <main className="container mx-auto px-5">
        <p data-lang="appreciation"></p>
        <p className="text-center">
          <a
            href={topPageUrl}
            className="text-blue-500"
            data-lang="top-link"
          ></a>
        </p>
      </main>
    </Public>
  )
}

export default ChannelEnded
