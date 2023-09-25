import { RedisOptions } from 'ioredis'

export default {
    mongoose: {
        uri: `mongodb://${process.env.MONGO_INITDB_USERNAME}:${process.env.MONGO_INITDB_PASSWORD}@${process.env.MONGO_HOSTNAME}:${process.env.MONGO_PORT}/${process.env.MONGO_INITDB_DATABASE}`,
    },
    redis: {
        host: process.env.DB_REDIS_HOSTNAME,
        port: +process.env.DB_REDIS_PORT,
    } as RedisOptions,
}