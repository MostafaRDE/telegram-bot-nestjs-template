import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Message } from 'node-telegram-bot-api'
import { AuthenticationService } from '../../authentication/authentication.service'
import { BotService } from '../../bot/bot.service'
import { QueuesEnum } from '../enums/queues.enum'
import { JobManagerService } from '../job-manager.service'
import { QueueProcessesEnum } from '../enums/queue-processes.enum'

@Processor(QueuesEnum.Authentication)
export class AuthenticationQueueProcess
{
    constructor(
        private readonly telegramBotService: BotService,
        private readonly jobManagerService: JobManagerService,
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Process()
    async default(job: Job<{ message: Message }>)
    {
        await this.jobManagerService.createNextProcess(job.data.message, undefined, {
            queue: QueuesEnum.Authentication,
            process: QueueProcessesEnum.AuthenticationSetFirstNameAndWaitForReceiveLastName,
        })
        await this.telegramBotService.sendMessage(job.data.message.chat.id, '💬 نام خود را وارد کنید')
    }

    @Process(QueueProcessesEnum.AuthenticationSetFirstNameAndWaitForReceiveLastName)
    async setFirstNameAndWaitForReceiveLastName(job: Job<{ message: Message }>)
    {
        const firstName = job.data.message.text?.trim() || ''
        if (!firstName)
        {
            return await this.default(job)
        }

        await this.jobManagerService.createNextProcess(job.data.message, { firstName }, {
            queue: QueuesEnum.Authentication,
            process: QueueProcessesEnum.AuthenticationSetLastNameAndCompleteRegistration,
        })
        await this.telegramBotService.sendMessage(job.data.message.chat.id, '💬 نام خانوادگی خود را وارد کنید')
    }

    @Process(QueueProcessesEnum.AuthenticationSetLastNameAndCompleteRegistration)
    async setLastNameAndCompleteRegistration(job: Job<{ message: Message, data: Record<string, unknown> }>)
    {
        const lastName = job.data.message.text?.trim() || ''
        if (!lastName)
        {
            job.data.message.text = job.data.data.firstName as string
            return await this.setFirstNameAndWaitForReceiveLastName(job)
        }

        if (await this.authenticationService.register({
            userTelegramId: job.data.message.chat.id,
            firstName: job.data.data.firstName as string,
            lastName,
        }))
        {
            await this.telegramBotService.sendMessage(job.data.message.chat.id, '✅ ثبت نام شما با موفقیت تکمیل شد')

            this.jobManagerService.doProcess(job.data.message, {
                queue: QueuesEnum.Entry,
            })
        }
        else
        {
            await this.telegramBotService.sendMessage(job.data.message.chat.id, '❌ ثبت نام شما با شکست مواجه شد؛ 🔃 لطفا مجددا امتحان کنید')

            this.jobManagerService.doProcess(job.data.message, { queue: QueuesEnum.Authentication })
        }
    }
}