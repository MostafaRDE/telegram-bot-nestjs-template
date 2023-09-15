import { Injectable, OnModuleInit } from '@nestjs/common'
import * as TelegramBot from 'node-telegram-bot-api'

@Injectable()
export class BotService implements OnModuleInit
{
    bot = new TelegramBot(process.env.TELEGRAM_API_TOKEN, { polling: true })

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

        console.log(message)
    }
}