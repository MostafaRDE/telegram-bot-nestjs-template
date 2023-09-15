import { RedisOptions } from 'ioredis'

export default {
    redis: {
        host: process.env.DB_REDIS_HOSTNAME,
        port: +process.env.DB_REDIS_PORT,
    } as RedisOptions,
}