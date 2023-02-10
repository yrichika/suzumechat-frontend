import Link from 'next/link'
import { useRouter } from 'next/router'

function Footer() {
  const router = useRouter()
  const showManualLink =
    process.env.NEXT_PUBLIC_MANUAL_PAGE_PATH != router.pathname
  const TWITTER_URL = process.env.NEXT_PUBLIC_TWITTER_LINK

  return (
    <div className="border-t-2 mt-2 bg-gray-100">
      <ul className="flex space-x-3 justify-center">
        {showManualLink && (
          <li>
            <Link href="/manual">
              <a target="_blank" className="text-blue-500 underline">
                Manual
              </a>
            </Link>
          </li>
        )}
        <li>
          <span>support&#64;</span>
          <a
            className="text-blue-500 underline"
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Twitter
          </a>
        </li>
      </ul>

      <footer className="mt-2">
        <p className="text-center">&copy; yrichika</p>
      </footer>
    </div>
  )
}

export default Footer
