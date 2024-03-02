import { PrismaClient } from '../../../generated/prisma';
import { log } from '../logger/logger';

export class PrismaService extends PrismaClient {
    async onModuleInit() {
        await this.$connect();
        log.info('connected to postgres with prisma');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        log.info('disconnected from postgres with prisma');
    }
}
