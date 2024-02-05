import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Config } from './config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Env } from './types/Env';
import { log } from './modules/logger/logger';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: log,
        }),
        {
            bufferLogs: true,
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

    log.info(await app.getUrl());
}
bootstrap();
