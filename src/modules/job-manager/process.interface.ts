import { QueueProcessesEnum } from './enums/queue-processes.enum'
import { QueuesEnum } from './enums/queues.enum'

export interface ProcessInterface
{
    queue: QueuesEnum
    process?: QueueProcessesEnum
    data?: Record<string, unknown>
}