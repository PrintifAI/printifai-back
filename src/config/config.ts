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
}

export const Config: Config = {
    PORT: parseInt(process.env.PORT || '3000', 10),
    ENV: (process.env.NODE_ENV as Env) || Env.Prod,
    REPLICATE_WEBHOOK_SECRET: process.env.REPLICATE_WEBHOOK_SECRET!,
    REPLICATE_HOST: process.env.REPLICATE_HOST!,
    REPLICATE_TOKEN: process.env.REPLICATE_TOKEN!,
    YANDEX_API_TOKEN: process.env.YANDEX_API_TOKEN!,
    YANDEX_API_HOST: process.env.YANDEX_API_HOST!,
    WEBHOOK_HOST: process.env.WEBHOOK_HOST!,
    CLIENT_HOST: process.env.CLIENT_HOST!,
};
