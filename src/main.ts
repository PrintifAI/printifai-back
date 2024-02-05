import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { WinstonModule } from 'nest-winston';
import { Config } from './config/main';
import { Logger } from './modules/logger/logger';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Env } from './types/Env';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        {
            logger: WinstonModule.createLogger({
                instance: Logger,
            }),
        },
    );

    if (Config.Env != Env.Prod) {
        const document = SwaggerModule.createDocument(
            app,
            new DocumentBuilder()
                .setTitle('PrintifAI Back')
                .setVersion('0.0')
                .build(),
        );

        SwaggerModule.setup('swagger', app, document);
    }

    await app.listen(Config.Port, '0.0.0.0');

    Logger.info(await app.getUrl());
}
bootstrap();
