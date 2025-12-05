import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class GetSignedUrlRequestDto {
    @ApiProperty({
        example: 'uploads/550e8400-e29b-41d4-a716-446655440000.jpg',
        description: 'S3 object key',
    })
    @IsNotEmpty()
    @IsString()
    key: string;

    @ApiProperty({
        example: 3600,
        description: 'URL expiration time in seconds (default: 3600 = 1 hour)',
        required: false,
    })
    @IsOptional()
    @IsNumber()
    @Min(60)
    @Max(604800)
    expiresIn?: number;
}
