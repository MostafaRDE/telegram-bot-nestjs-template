import { AuthenticationQueueProcess } from './authentication.queue.process'
import { EntryQueueProcess } from './entry.queue.process'

export const processors = [
    AuthenticationQueueProcess,
    EntryQueueProcess,
]