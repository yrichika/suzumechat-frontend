import Public from '@components/common/templates/Public'
import { langMap } from '@lang/guest/ended/langMap'
import { useRouter } from 'next/router'

function ChannelEnded() {
  const topPageUrl = process.env.NEXT_PUBLIC_FRONT_URL
  const router = useRouter()
  const isEndedByHost = router.query?.byWho === 'host'

  return (
    <Public langMap={langMap}>
      <main className="container mx-auto px-5 h-96">
        <p
          className={'text-center bold' + (isEndedByHost ? '' : ' hidden')}
          data-lang="ended-by-host"
        ></p>
        <div className="mt-3">
          <p data-lang="appreciation"></p>
          <p data-lang="if-as-host"></p>
          <p className="text-center">
            <a
              href={topPageUrl}
              className="text-blue-500"
              data-lang="top-link"
            ></a>
          </p>
        </div>
      </main>
    </Public>
  )
}

export default ChannelEnded
