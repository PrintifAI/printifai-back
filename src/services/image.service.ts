import { Injectable } from '@nestjs/common';
import axios from 'axios';
import sharp from 'sharp';

@Injectable()
export class ImageService {
    async applyWatermark(image: Buffer): Promise<Buffer> {
        const waterMark = await sharp('images/logo.svg')
            .ensureAlpha(0.1)
            .resize(200, 200)
            .toBuffer();

        return await sharp(image)
            .composite([
                {
                    input: waterMark,
                    top: 400,
                    left: 300,
                },
            ])
            .toBuffer();
    }

    async downloadImage(url: string): Promise<Buffer> {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });

        const imageBuffer = Buffer.from(response.data, 'binary');

        return imageBuffer;
    }
}
