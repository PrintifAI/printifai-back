import 'dotenv/config';
import { Env } from '../types/Env';

export interface Config {
    PORT: number;
    ENV: Env;
    REPLICATE_WEBHOOK_SECRET: string;
    REPLICATE_HOST: string;
    REPLICATE_TOKEN: string;
    YANDEX_API_TOKEN: string;
    YANDEX_API_HOST: string;
    WEBHOOK_HOST: string;
    CLIENT_HOST: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASS: string;
    ADMIN_TOKEN: string;
}

export const Config: Config = {
    PORT: +(process.env.PORT || 3000),
    ENV: (process.env.NODE_ENV as Env) || Env.Prod,
    REPLICATE_WEBHOOK_SECRET: process.env.REPLICATE_WEBHOOK_SECRET!,
    REPLICATE_HOST: process.env.REPLICATE_HOST!,
    REPLICATE_TOKEN: process.env.REPLICATE_TOKEN!,
    YANDEX_API_TOKEN: process.env.YANDEX_API_TOKEN!,
    YANDEX_API_HOST: process.env.YANDEX_API_HOST!,
    WEBHOOK_HOST: process.env.WEBHOOK_HOST!,
    CLIENT_HOST: process.env.CLIENT_HOST!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: +(process.env.REDIS_PORT || 6379),
    REDIS_PASS: process.env.REDIS_PASS!,
    ADMIN_TOKEN: process.env.ADMIN_TOKEN!,
};
