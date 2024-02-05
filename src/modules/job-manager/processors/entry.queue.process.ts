import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { Message } from 'node-telegram-bot-api'
import { QueuesEnum } from '../enums/queues.enum'
import { BotService } from '../../bot/bot.service'
import { JobManagerService } from '../job-manager.service'
import { BotKeboardMainEnum } from '../../bot/enums/keyboards/bot.keyboard.main.enum'
import { AuthenticationService } from '../../authentication/authentication.service'

@Processor(QueuesEnum.Entry)
export class EntryQueueProcess
{
    constructor(
        private readonly telegramBotService: BotService,
        private readonly jobManagerService: JobManagerService,
        private readonly authenticationService: AuthenticationService,
    ) {}

    @Process()
    async default(job: Job<{ message: Message }>)
    {
        if (await this.authenticationService.isAccountExists(job.data.message.from.id))
        {
            await this.telegramBotService.sendMessage(
                job.data.message.chat.id,
                'لطفا گزینه مورد نظر را انتخاب کنید ✌️',
                { reply_markup: {
                    resize_keyboard: true,
                    one_time_keyboard: true,
                    keyboard: [
                        [ { text: BotKeboardMainEnum.ShowServices } ],
                        [ { text: BotKeboardMainEnum.AboutUs } ],
                        [ { text: BotKeboardMainEnum.PrivacyPolicy } ],
                    ],
                } },
            )
        }
        else
        {
            await this.telegramBotService.sendMessage(job.data.message.chat.id, '👋 سلام، به ربات تست خوش آمدید')
            await this.telegramBotService.sendMessage(job.data.message.chat.id, '🏃‍♂️ لطفا جهت استفاده از خدمات ما ابتدا ثبت نام کنید')
            this.jobManagerService.doProcess(job.data.message, { queue: QueuesEnum.Authentication })
        }
    }
}