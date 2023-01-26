export default interface ChatMessage {
  id: number // FIXME: not used?
  name: string
  message: string
  color: string
  timestamp: number
  timeMarkerToDelete?: number
}
