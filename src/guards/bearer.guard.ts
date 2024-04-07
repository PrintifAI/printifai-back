import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Config } from '../config/config';

@Injectable()
export class BearerGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest() as FastifyRequest;

        const token = request.headers['authorization']?.split(' ')[1];

        return token === Config.ADMIN_TOKEN;
    }
}
