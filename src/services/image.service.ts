import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as sharp from 'sharp';

@Injectable()
export class ImageService {
    async downloadImage(url: string): Promise<Buffer> {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        const imageBuffer = Buffer.from(response.data, 'binary');

        const waterMark = await sharp('images/logo.svg')
            .ensureAlpha(0.1)
            .resize(200, 200)
            .toBuffer();

        return await sharp(imageBuffer)
            .composite([
                {
                    input: waterMark,
                    top: 400,
                    left: 300,
                },
            ])
            .toBuffer();
    }
}
