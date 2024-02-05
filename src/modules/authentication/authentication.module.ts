import { Global, Module } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/database/mongoose/schemas/user.schema'

@Global()
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
        ]),
    ],
    providers: [ AuthenticationService ],
    exports: [ AuthenticationService ],
})
export class AuthenticationModule {}