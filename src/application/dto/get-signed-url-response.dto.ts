import { ApiProperty } from '@nestjs/swagger';

export class GetSignedUrlResponseDto {
    @ApiProperty({
        example:
            'https://bucket.s3.region.amazonaws.com/uploads/550e8400-e29b-41d4-a716-446655440000.jpg?...',
    })
    signedUrl: string;

    @ApiProperty({ example: 3600 })
    expiresIn: number;

    @ApiProperty({ example: 'uploads/550e8400-e29b-41d4-a716-446655440000.jpg' })
    key: string;
}
