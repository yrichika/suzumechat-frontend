import { TailwindColor } from './TailwindColor'

export default interface ChatMessage {
  id: number // FIXME: not used?
  name: string
  message: string
  color: TailwindColor
  timestamp: number
  timeMarkerToDelete?: number
}
