import { BadRequestException, Injectable } from '@nestjs/common';
import { RedisService } from '../modules/redis/redis.service';
import { Config } from '../config/config';
import { Env } from '../types/Env';

const getRedisThrottleKey = (throttleKey: string) => `throttle:${throttleKey}`;
const MAX_REQUESTS_NUMBERS = 10;
const THROTTLE_TIME_IN_SECONDS = Config.ENV === Env.Local ? 1 : 60 * 60 * 24;

@Injectable()
export class ThrottleService {
    constructor(private readonly redisService: RedisService) {}

    async throttle(value: string): Promise<void> {
        try {
            const count = +(
                (await this.redisService.client.get(
                    getRedisThrottleKey(value),
                )) || 0
            );

            if (count < MAX_REQUESTS_NUMBERS) {
                this.redisService.client.set(
                    getRedisThrottleKey(value),
                    count + 1,
                    'EX',
                    THROTTLE_TIME_IN_SECONDS,
                );
            } else {
                throw new BadRequestException('Слишком много запросов');
            }
        } catch (e) {
            if (!(e instanceof BadRequestException)) {
                return;
            }
            throw e;
        }
    }

    async remaining(value: string): Promise<number> {
        return (
            MAX_REQUESTS_NUMBERS -
            +(
                (await this.redisService.client.get(
                    getRedisThrottleKey(value),
                )) || 0
            )
        );
    }
}
