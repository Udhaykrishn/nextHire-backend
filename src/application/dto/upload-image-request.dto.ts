import { ApiProperty } from '@nestjs/swagger';

export class UploadImageRequestDto {
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file to upload (max 5MB)',
    })
    file: Express.Multer.File;
}
