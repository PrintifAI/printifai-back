import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { getResponseByExceptionPrototype } from '../utils/getResponseByExceptionPrototype';
import { log } from '../modules/logger/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<FastifyRequest>();
        const reply = ctx.getResponse<FastifyReply>();

        const { url, method, body } = request;

        // Обработка ошибок валидации
        const { externalMessage, code } =
            getResponseByExceptionPrototype(exception);
        const internalMessage = exception.message || externalMessage;

        log.error(exception, internalMessage, {
            url,
            method,
            body,
        });

        reply.code(code).send(externalMessage);
    }
}
