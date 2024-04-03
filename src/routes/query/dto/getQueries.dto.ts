import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetQueriesDto {
    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    @Transform(({ value }) => value && Number(value))
    readonly size?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(100)
    @Transform(({ value }) => value && Number(value))
    readonly page?: number;
}
