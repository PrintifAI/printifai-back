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
                    '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
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
                    '95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1',
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
