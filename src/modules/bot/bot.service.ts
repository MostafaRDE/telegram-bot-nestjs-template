import { Injectable, OnModuleInit } from '@nestjs/common'
import * as TelegramBot from 'node-telegram-bot-api'
import { JobManagerService } from '../job-manager/job-manager.service'
import { QueuesEnum } from '../job-manager/enums/queues.enum'

@Injectable()
export class BotService implements OnModuleInit
{
    bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true })

    constructor(
        private readonly jobManagerService: JobManagerService,
    ) {}

    onModuleInit()
    {
        this.bot.on(
            'message',
            this.onReceivedMessageHandler.bind(this) as
                (message: TelegramBot.Message, metadata: TelegramBot.Metadata) => void,
        )
    }

    checkHasCorrectAccess(message: TelegramBot.Message)
    {
        if (message.chat.type === 'private')
        {
            throw new Error('You have not correct access')
        }
    }

    private async onReceivedMessageHandler(message: TelegramBot.Message, metadata: TelegramBot.Metadata)
    {
        try
        {
            this.checkHasCorrectAccess(message)
        }
        catch
        {
            await this.bot.sendMessage(message.chat.id, 'You have not correct access 🚫✋')
        }

        // Check queue processes or queue jobs
        const nextProcessDetails = await this.jobManagerService.getNextProcessIfExists(message)

        // const processForCommandOrKeyboard = this.getProcessForCommandOrKeyboardIfIt(message)
        // if (processForCommandOrKeyboard)
        // {
        //     await this.jobManagerService.removeNextProcessIfExists(message)
        // }
        // else if (nextProcessDetails)
        // {
        //     return this.jobManagerService.doProcess(message, nextProcessDetails)
        // }

        return this.jobManagerService.doProcess(message, {
            queue: QueuesEnum.Entry,
        })
    }
}