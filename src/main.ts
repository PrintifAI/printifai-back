import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Config } from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { log } from './modules/logger/logger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: log,
        }),
        {
            rawBody: true,
            bufferLogs: true,
        },
    );

    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle('PrintifAI Back')
            .setVersion('1.0.0')
            .build(),
    );

    SwaggerModule.setup('api/swagger', app, document);

    app.setGlobalPrefix('api');

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableShutdownHooks();

    await app.listen(Config.PORT, '0.0.0.0');

    log.info(await app.getUrl());
}
bootstrap();
