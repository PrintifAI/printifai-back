import { Injectable } from '@nestjs/common';
import { ReplicatePrediction } from '../types/replicateTypes';
import axios from 'axios';
import { Config } from '../config/config';

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
                },
                webhook: `${Config.WEBHOOK_HOST}/api/webhook/replicate`,
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
