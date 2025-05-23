import { Injectable } from '@nestjs/common';
import { ReplicatePrediction } from '../types/replicateTypes';
import axios from 'axios';
import { Config } from '../config/config';
import { Prediction } from '../../generated/prisma';
import { getImageLink } from '../utils/getImageLink';

@Injectable()
export class ReplicateService {
    async createPrediction(prompt: string): Promise<ReplicatePrediction> {
        const response = await axios.post<ReplicatePrediction>(
            `${Config.REPLICATE_HOST}/predictions`,
            {
                version:
                    '7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc',
                input: {
                    prompt,
                    width: 856,
                    height: 1208,
                    apply_watermark: false,
                    disable_safety_checker: true,
                },
                webhook: `${Config.WEBHOOK_HOST}/api/webhook/replicate/image`,
                webhook_events_filter: ['completed'],
            },
            {
                headers: {
                    Authorization: `Token ${Config.REPLICATE_TOKEN}`,
                },
            },
        );
        return response.data;
    }

    async createRemoveBackground(
        prediction: Prediction,
    ): Promise<ReplicatePrediction> {
        const response = await axios.post<ReplicatePrediction>(
            `${Config.REPLICATE_HOST}/predictions`,
            {
                version:
                    'fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003',
                input: {
                    image: getImageLink(prediction.id),
                },
                webhook: `${Config.WEBHOOK_HOST}/api/webhook/replicate/remove-background`,
                webhook_events_filter: ['completed'],
            },
            {
                headers: {
                    Authorization: `Token ${Config.REPLICATE_TOKEN}`,
                },
            },
        );
        return response.data;
    }
}
