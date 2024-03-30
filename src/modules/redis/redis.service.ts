import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { log } from '../logger/logger';
import Redis from 'ioredis';
import { Config } from '../../config/config';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
    readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: Config.REDIS_HOST,
            port: Config.REDIS_PORT,
            password: Config.REDIS_PASS,
            lazyConnect: true,
        });

        this.client.on('error', (e) => {
            log.error(e, 'redis connection error');
        });
    }

    async onModuleInit() {
        await this.client.connect();
        log.info('connected to redis');
    }

    async onModuleDestroy() {
        await this.client.disconnect();
        log.info('disconnected from redis');
    }
}
