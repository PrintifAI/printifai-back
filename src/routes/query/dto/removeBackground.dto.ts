import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveBackgroundDto {
    @IsString()
    @IsNotEmpty()
    readonly predictionId: string;
}
