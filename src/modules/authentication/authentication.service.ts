import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from '../../database/mongoose/schemas/user.schema'

@Injectable()
export class AuthenticationService
{
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) {}

    async isAccountExists(userTelegramId: number): Promise<boolean>
    {
        return !!(await this.userModel.findOne({ userTelegramId }))
    }

    async register(fields: { firstName: string, lastName: string, userTelegramId: number }): Promise<boolean>
    {
        try
        {
            await this.userModel.create(fields)
            return true
        }
        catch { return false }
    }
}