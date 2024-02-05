import { Global, Module } from '@nestjs/common'
import { JobManagerService } from './job-manager.service'
import { BullModule } from '@nestjs/bull'
import { QueuesEnum } from './enums/queues.enum'
import { processors } from './processors'

@Global()
@Module({
    imports: [
        BullModule.registerQueue({ name: QueuesEnum.Authentication }),
        BullModule.registerQueue({ name: QueuesEnum.Entry }),
    ],
    providers: [
        ...processors,
        JobManagerService,
    ],
    exports: [
        JobManagerService,
    ],
})
export class JobManager {}