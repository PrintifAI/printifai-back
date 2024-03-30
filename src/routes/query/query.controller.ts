import {
    BadRequestException,
    Controller,
    Get,
    Header,
    Ip,
    NotFoundException,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { QueryDto } from './dto/query.dto';
import { TranslateService } from '../../services/translate.service';
import {
    Prediction,
    PredictionStatus,
    RemoveBackground,
} from '../../../generated/prisma';
import { ReplicateService } from '../../services/replicate.service';
import { PrismaService } from '../../modules/prisma/prisma.service';
import { ImageService } from '../../services/image.service';
import { ThrottleService } from '../../services/throttle.service';
import { RemoveBackgroundDto } from './dto/removeBackground.dto';

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

    @Post('remove-background')
    async removeBackground(
        @Query() queryDto: RemoveBackgroundDto,
        @Ip() ip: string,
    ): Promise<RemoveBackground> {
        await this.throttleService.throttle(`remove-background:${ip}`);

        const prediction = await this.prismaService.prediction.findUnique({
            where: {
                id: queryDto.predictionId,
            },
        });

        if (!prediction) {
            throw new NotFoundException('Prediction not found');
        }

        const removedBackground =
            await this.prismaService.removeBackground.findFirst({
                where: {
                    status: {
                        in: [PredictionStatus.Ready, PredictionStatus.Created],
                    },
                    predictionId: prediction.id,
                },
            });

        if (removedBackground) {
            throw new BadRequestException('Remove background unavailable');
        }

        const replicateResponse =
            await this.replicateService.createRemoveBackground(prediction);

        if (replicateResponse.error) {
            throw new BadRequestException(replicateResponse.error);
        }

        return this.prismaService.removeBackground.create({
            data: {
                externalId: replicateResponse.id,
                predictionId: prediction.id,
            },
        });
    }

    @Get('remaining')
    async getRemain(@Ip() ip: string): Promise<number> {
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
                removedBackground: {
                    where: {
                        status: PredictionStatus.Ready,
                    },
                    select: {
                        status: true,
                    },
                },
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

    @Get('query/:id/removed-background')
    @Header('Content-Type', 'image/png')
    async getRemovedBackgroundImage(
        @Param('id') predictionId: string,
    ): Promise<Buffer> {
        const prediction = await this.prismaService.prediction.findFirst({
            where: {
                id: predictionId,
            },
            select: {
                removedBackground: {
                    where: {
                        status: PredictionStatus.Ready,
                    },
                },
            },
        });

        if (!prediction || !prediction.removedBackground.length) {
            throw new NotFoundException('Изображение не найдено');
        }

        return prediction.removedBackground[0].output!;
    }
}
