import { AuthenticationModule } from '../../modules/authentication/authentication.module'
import { BotModule } from '../../modules/bot/bot.module'
import { JobManager } from '../../modules/job-manager/job-manager.module'

export const internalsImportsAppModule = [
    AuthenticationModule,
    BotModule,
    JobManager,
]