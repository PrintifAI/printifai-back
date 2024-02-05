import { Module } from '@nestjs/common';
import { TestModule } from './routes/test/test.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
    imports: [TestModule, PrismaModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
