import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Config } from '../config/config';
import { YandexTranslateResponse } from '../types/yandexApiTypes';

@Injectable()
export class TranslateService {
    async translate(source: string): Promise<string> {
        const response = await axios.post<YandexTranslateResponse>(
            `${Config.YANDEX_API_HOST}`,
            {
                sourceLanguageCode: 'ru',
                targetLanguageCode: 'en',
                texts: [source],
                speller: true,
            },
            {
                headers: {
                    Authorization: `Api-Key ${Config.YANDEX_API_TOKEN}`,
                },
            },
        );

        return response.data.translations[0].text;
    }
}
