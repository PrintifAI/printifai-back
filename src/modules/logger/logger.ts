import pino from 'pino';

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
                options: { destination: './logs/all.log' },
            },
        ],
    },
});
