import { useEffect, useState } from 'react'
import VisitorsRequest from 'types/VisitorsRequest'

export default function useVisitorsRequestsSse(hostChannelToken: string) {
  const [eventSource, setEventSource] = useState<EventSource>()
  const [requests, setRequests] = useState<Array<VisitorsRequest>>([])
  const sseUrl = `${process.env.NEXT_PUBLIC_BACK_URL}/host/requestStatus/${hostChannelToken}`

  useEffect(() => {
    // setTimeout(() => {
    const eventSource = new EventSource(sseUrl, { withCredentials: true })

    eventSource.onopen = () => {
      console.log('connection established')
    }

    eventSource.onerror = event => {
      console.warn('there was an error with sse: ')
      console.log(event)
    }

    eventSource.onmessage = event => {
      console.log('SSE message: ' + event.data)
      setRequests(JSON.parse(event.data))
    }

    setEventSource(eventSource)
    // }, 3000)
  }, [])

  return {
    eventSource,
    requests,
  }
}
