import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Header,
    Ip,
    NotFoundException,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { TranslateService } from '../../services/translate.service';
import { Prediction, PredictionStatus } from '../../../generated/prisma';
import { ReplicateWebhookGuard } from '../../guards/ReplicateWebhookGuard';
import { ReplicateService } from '../../services/replicate.service';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { ImageService } from '../../services/image.service';
import {
    ReplicatePrediction,
    ReplicateStatus,
} from '../../types/replicateTypes';
import { log } from '../../modules/logger/logger';
import { ThrottleService } from '../../services/throttle.service';

@Controller()
export class QueryController {
    constructor(
        private readonly translateService: TranslateService,
        private readonly replicateService: ReplicateService,
        private readonly prismaService: PrismaService,
        private readonly imageService: ImageService,
        private readonly throttleService: ThrottleService,
    ) {}

    @Post('query')
    async createPrediction(
        @Query() queryDto: QueryDto,
        @Ip() ip: string,
    ): Promise<Prediction> {
        await this.throttleService.throttle(ip);

        const tranlatedPrompt = await this.translateService.translate(
            queryDto.prompt,
        );

        const replicateResponse =
            await this.replicateService.createPrediction(tranlatedPrompt);

        if (replicateResponse.error) {
            throw new BadRequestException(replicateResponse.error);
        }

        return this.prismaService.prediction.create({
            data: {
                predictionId: replicateResponse.id,
                sourcePrompt: queryDto.prompt,
                translatedPrompt: tranlatedPrompt,
            },
        });
    }

    @Get('remaining')
    async getRemain(
        // @Query('fingerprint') fingerprint: string,
        @Ip() ip: string,
    ): Promise<number> {
        return this.throttleService.remaining(ip);
    }

    @Get('query/:id')
    async getPrediction(
        @Param('id') queryId: string,
    ): Promise<Partial<Prediction>> {
        const prediction = await this.prismaService.prediction.findUnique({
            where: {
                id: queryId,
            },
            select: {
                id: true,
                status: true,
                sourcePrompt: true,
            },
        });

        if (!prediction) {
            throw new NotFoundException('Запрос не найден');
        }

        return prediction;
    }

    @Get('query/:id/image')
    @Header('Content-Type', 'image/png')
    async getPredictionOutout(@Param('id') queryId: string): Promise<Buffer> {
        const prediction = await this.prismaService.prediction.findUnique({
            where: {
                id: queryId,
            },
            select: {
                output: true,
            },
        });

        if (!prediction || !prediction.output) {
            throw new NotFoundException('Изображение не найдено');
        }

        return prediction.output;
    }

    @Post('webhook/replicate')
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
            if (body.output?.length) {
                image = await this.imageService.downloadImage(body.output[0]);
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
}
