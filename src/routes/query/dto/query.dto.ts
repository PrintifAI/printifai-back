import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class QueryDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(300)
    readonly prompt: string;

    @IsString()
    @IsNotEmpty()
    readonly fingerprint: string;
}
