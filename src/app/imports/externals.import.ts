import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { configLoader } from '../../config'
import { BullModule } from '@nestjs/bull'

export const externalsImportsAppModule = [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({ envFilePath: '.env', load: [ configLoader ], isGlobal: true }),
    BullModule.forRootAsync({
        imports: [ ConfigModule ],
        inject: [ ConfigService ],
        useFactory: (configService: ConfigService) => ({
            redis: configService.get('database.redis'),
        }),
    }),
    // MongooseModule.forRootAsync({
    //     useClass: MongooseConfigService,
    // }),
]