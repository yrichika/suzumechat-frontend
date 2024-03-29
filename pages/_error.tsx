import Public from '@components/common/templates/Public'
import { langMap } from '@lang/error/langMap'
function Error({ statusCode }: any) {
  return (
    <Public langMap={langMap}>
      <div className="h-96">
        <p className="text-center">
          <span data-lang="error-message"></span>
          <span>{statusCode ?? 'client error'}</span>
        </p>
      </div>
    </Public>
  )
}

Error.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
