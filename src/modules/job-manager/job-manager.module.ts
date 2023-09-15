import { Global, Module } from '@nestjs/common'
import { JobManagerService } from './job-manager.service'

@Global()
@Module({
    providers: [
        JobManagerService,
    ],
    exports: [
        JobManagerService,
    ],
})
export class JobManager {}