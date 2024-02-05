import pino from 'pino';

const LOG_FILE_DEST = './logs/all.log';

export const log = pino({
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        targets: [
            {
                level: 'info',
                target: 'pino-pretty',
                options: {},
            },
            {
                level: 'trace',
                target: 'pino/file',
                options: { destination: LOG_FILE_DEST, mkdir: true },
            },
        ],
    },
});
