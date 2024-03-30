import {
    Body,
    Controller,
    NotFoundException,
    Post,
    UseGuards,
} from '@nestjs/common';

import { PredictionStatus } from '../../../generated/prisma';
import { ReplicateWebhookGuard } from '../../guards/ReplicateWebhookGuard';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { ImageService } from '../../services/image.service';
import {
    ReplicatePrediction,
    ReplicateStatus,
} from '../../types/replicateTypes';
import { log } from '../../modules/logger/logger';

@Controller()
export class WebhookController {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly imageService: ImageService,
    ) {}

    @Post('webhook/replicate/image')
    @UseGuards(ReplicateWebhookGuard)
    async predictionWebhook(@Body() body: ReplicatePrediction): Promise<void> {
        const prediction = await this.prismaService.prediction.findFirst({
            where: {
                predictionId: body.id,
            },
        });

        if (!prediction) {
            throw new NotFoundException('Prediction not found');
        }

        let image: Buffer | null = null;
        let status: PredictionStatus = PredictionStatus.Created;
        try {
            const output = body.output as string[];
            if (output?.length) {
                image = await this.imageService.downloadImage(output[0]);
            }

            if (body.status === ReplicateStatus.Succeeded) {
                status = PredictionStatus.Ready;
            } else {
                status = PredictionStatus.Failed;
            }
        } catch (e) {
            status = PredictionStatus.Failed;
            log.error(e);
        } finally {
            await this.prismaService.prediction.update({
                where: {
                    predictionId: body.id,
                },
                data: {
                    status,
                    predictionTime: body?.metrics?.predict_time || null,
                    output: image,
                },
            });
        }
    }

    @Post('webhook/replicate/remove-background')
    @UseGuards(ReplicateWebhookGuard)
    async removeBackgroundWebhook(
        @Body() body: ReplicatePrediction,
    ): Promise<void> {
        console.log(body);
        const replicatePrediction =
            await this.prismaService.removeBackground.findUnique({
                where: {
                    externalId: body.id,
                },
            });

        if (!replicatePrediction) {
            throw new NotFoundException('Prediction not found');
        }

        let image: Buffer | null = null;
        let status: PredictionStatus = PredictionStatus.Created;
        try {
            if (body.output) {
                image = await this.imageService.downloadImage(
                    body.output as string,
                );
            }

            if (body.status === ReplicateStatus.Succeeded) {
                status = PredictionStatus.Ready;
            } else {
                status = PredictionStatus.Failed;
            }
        } catch (e) {
            status = PredictionStatus.Failed;
            log.error(e);
        } finally {
            await this.prismaService.removeBackground.update({
                where: {
                    externalId: body.id,
                },
                data: {
                    status,
                    predictionTime: body?.metrics?.predict_time || null,
                    output: image,
                },
            });
        }
    }
}
