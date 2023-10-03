import { InjectQueue } from '@nestjs/bull'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { Cache } from 'cache-manager'
import { Message } from 'node-telegram-bot-api'
import { QueueProcessesEnum } from './enums/queue-processes.enum'
import { QueuesEnum } from './enums/queues.enum'
import { ProcessInterface } from './process.interface'

@Injectable()
export class JobManagerService
{
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectQueue(QueuesEnum.Authentication)
        private readonly authenticationQueue: Queue,
        @InjectQueue(QueuesEnum.Entry)
        private readonly entryQueue: Queue,
    ) {}

    async getNextProcessIfExists(message: Message, canRemoveProcess = false)
    {
        const result = await this.cacheManager.get<ProcessInterface>(`account-process-${ message.from.id }`)

        if (canRemoveProcess)
        {
            await this.removeNextProcessIfExists(message)
        }

        return result
    }

    async removeNextProcessIfExists(message: Message)
    {
        await this.cacheManager.del(`account-process-${ message.from.id }`)
    }

    doProcess(message: Message, options?: {
        queue?: QueuesEnum, process?: QueueProcessesEnum, data?: Record<string, unknown>,
    })
    {
        const queue = options?.queue || QueuesEnum.Entry
        const process = options?.process

        if (options?.process)
            void this[ `${ queue }Queue` ].add(process, { message, data: options?.data })
        else void this[ `${ queue }Queue` ].add({ message, data: options?.data })
    }

    async createNextProcess(message: Message, data: Record<string, unknown>, options?: {
        queue?: QueuesEnum, process?: QueueProcessesEnum, ttl?: number,
    })
    {
        await this.cacheManager.set(
            `account-process-${ message.from.id }`, {
                data,
                queue: options?.queue || QueuesEnum.Entry,
                process: options?.process,
            } as { queue: QueuesEnum, process?: QueueProcessesEnum, data: Record<string, unknown> },
            options?.ttl || 300_000,
        )
    }
}