import { Injectable, OnModuleInit } from '@nestjs/common'
import * as TelegramBot from 'node-telegram-bot-api'
import { JobManagerService } from '../job-manager/job-manager.service'
import { QueuesEnum } from '../job-manager/enums/queues.enum'
import { BotCommandsEnum } from './enums/bot.commands.enum'
import { BotKeboardMainEnum } from './enums/keyboards/bot.keyboard.main.enum'
import { ProcessInterface } from '../job-manager/process.interface'

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
        if (message.chat.type !== 'private')
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

        const processForCommandOrButtonKeyboard = this.getProcessForCommandOrKeyboardIfExists(message)
        if (processForCommandOrButtonKeyboard)
        {
            await this.jobManagerService.removeNextProcessIfExists(message)

            return this.jobManagerService.doProcess(message, {
                queue: processForCommandOrButtonKeyboard.queue,
                process: processForCommandOrButtonKeyboard.process,
            })
        }
        else if (nextProcessDetails)
        {
            return this.jobManagerService.doProcess(message, nextProcessDetails)
        }

        return this.jobManagerService.doProcess(message, {
            queue: QueuesEnum.Entry,
        })
    }

    private getProcessForCommandOrKeyboardIfExists(message: TelegramBot.Message): ProcessInterface | void
    {
        const processOfCommand = this.getProcessOfCommand(message)
        if (processOfCommand)
            return processOfCommand

        const processOfButtonKeyboard = this.getProcessOfButtonKeyboardIfTextMessageIsAButtonOfAllKeyboardsButtons(message)
        if (processOfButtonKeyboard)
            return processOfButtonKeyboard
    }

    private getProcessOfCommand(message: TelegramBot.Message): ProcessInterface | void
    {
        if (message.entities)
        {
            if (message.entities.length > 1)
                throw new Error('Please insert just one command')

            if (message.entities[ 0 ].offset > 0)
                throw new Error('Please insert the command from start of message-editor box')

            for (let entity of message.entities)
            {
                if (entity.type === 'bot_command')
                {
                    const command = message.text.substring(entity.offset + 1, entity.offset + entity.length)
                    switch (command)
                    {
                        case BotCommandsEnum.Start:
                        {
                            break
                        }
                    }
                }
            }
        }
    }

    private getProcessOfButtonKeyboardIfTextMessageIsAButtonOfAllKeyboardsButtons(message: TelegramBot.Message): ProcessInterface | void
    {
        switch (message.text)
        {
            case BotKeboardMainEnum.AboutUs:
            {
                break
            }

            case BotKeboardMainEnum.PrivacyPolicy:
            {
                break
            }

            case BotKeboardMainEnum.ShowServices:
            {
                break
            }
        }
    }
}