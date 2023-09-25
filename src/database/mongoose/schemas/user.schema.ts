import { Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema()
export class User
{
    firstName: string
    lastName: string
}

export const UserSchema = SchemaFactory.createForClass(User)