import {
    Injectable,
    CanActivate,
    ExecutionContext,
    RawBodyRequest,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Config } from '../config/config';
import { createHmac } from 'node:crypto';

@Injectable()
export class ReplicateWebhookGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context
            .switchToHttp()
            .getRequest() as RawBodyRequest<FastifyRequest>;

        const webhookId = request.headers['webhook-id'];
        const webhookTimestamp = request.headers['webhook-timestamp'];

        const signedContent = `${webhookId}.${webhookTimestamp}.${request.rawBody}`;

        const secretBytes = Buffer.from(
            Config.REPLICATE_WEBHOOK_SECRET.split('_')[1],
            'base64',
        );

        const computedSignature = createHmac('sha256', secretBytes)
            .update(signedContent)
            .digest('base64');

        const webhookSignatures = request.headers[
            'webhook-signature'
        ]! as string;

        const expectedSignatures = webhookSignatures
            .split(' ')
            .map((sig) => sig.split(',')[1]);

        const isValid = expectedSignatures.some(
            (expectedSignature) => expectedSignature === computedSignature,
        );

        return isValid;
    }
}
