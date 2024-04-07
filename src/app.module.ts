import { Module, Scope } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { QueryController } from './routes/query/query.controller';
import { ReplicateService } from './services/replicate.service';
import { TranslateService } from './services/translate.service';
import { ImageService } from './services/image.service';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/exception.filter';
import { ThrottleService } from './services/throttle.service';
import { RedisModule } from './modules/redis/redis.module';
import { WebhookController } from './routes/webhook/webhook.controller';
import { OrderController } from './routes/order/order.controller';

@Module({
    imports: [PrismaModule, RedisModule],
    controllers: [QueryController, WebhookController, OrderController],
    providers: [
        ReplicateService,
        ImageService,
        TranslateService,
        ThrottleService,
        {
            provide: APP_FILTER,
            scope: Scope.REQUEST,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {}
