import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User
{
    @Prop()
    userTelegramId: number

    @Prop()
    firstName: string

    @Prop()
    lastName: string
}

export const UserSchema = SchemaFactory.createForClass(User)