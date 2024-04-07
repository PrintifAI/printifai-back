import { IsJSON } from 'class-validator';

export class OrderDto {
    @IsJSON()
    readonly data: string;
}
