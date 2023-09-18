import { Global, Module } from '@nestjs/common'
import { JobManagerService } from './job-manager.service'
import { BullModule } from '@nestjs/bull'
import { QueuesEnum } from './enums/queues.enum'

@Global()
@Module({
    imports: [
        BullModule.registerQueue({ name: QueuesEnum.Entry }),
    ],
    providers: [
        JobManagerService,
    ],
    exports: [
        JobManagerService,
    ],
})
export class JobManager {}