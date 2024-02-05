import 'dotenv/config';
import { Env } from '../types/Env';

export interface Config {
    Port: number;
    Env: Env;
}

export const Config: Config = {
    Port: parseInt(process.env.PORT || '3000', 10),
    Env: (process.env.NODE_ENV as Env) || Env.Prod,
};
