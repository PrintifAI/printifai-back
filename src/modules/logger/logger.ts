import { createLogger, format, transports } from 'winston';
import { Config } from '../../config/main';
import { Env } from '../../types/Env';

export const Logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
    ),
    rejectionHandlers: [
        new transports.File({ filename: 'logs/rejections.log' }),
    ],
    transports: [
        new transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new transports.File({ filename: 'logs/all.log' }),
    ],
});

if (Config.Env != Env.Prod) {
    Logger.add(
        new transports.Console({
            format: format.combine(format.colorize(), format.simple()),
        }),
    );
}
