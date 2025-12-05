import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { EnvConfig } from '@/infrastructure/config';

import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { IS3Service } from '../interface';

export interface FileInfo {
    key: string;
    name: string;
    bucket: string;
    size: number;
    url: string;
}

@Injectable()
export class S3Service implements IS3Service<FileInfo, Express.Multer.File> {
    private readonly s3Client: S3Client;
    private readonly bucket: string;

    constructor(private readonly configService: ConfigService<EnvConfig>) {
        this.s3Client = new S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY')!,
                secretAccessKey: this.configService.get('AWS_SECRET_KEY')!,
            },
        });

        this.bucket = this.configService.get('S3_BUCKET_NAME')!;
    }

    async uploadFile(file: Express.Multer.File): Promise<FileInfo> {
        const ext = path.extname(file.originalname);
        const key = `uploads/${uuid()}${ext}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        const url = await this.getSignedUrlForRead(key);

        return {
            key,
            name: file.originalname,
            bucket: this.bucket,
            size: file.size,
            url,
        };
    }

    async updateFile(key: string, file: Express.Multer.File): Promise<FileInfo> {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        const url = await this.getSignedUrlForRead(key);

        return {
            key,
            name: file.originalname,
            bucket: this.bucket,
            size: file.size,
            url,
        };
    }

    async deleteFile(key: string): Promise<void> {
        await this.s3Client.send(
            new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            }),
        );
    }

    async getSignedUrlForRead(
        key: string,
        expiresIn = 3600,
    ): Promise<string> {
        return getSignedUrl(
            this.s3Client,
            new GetObjectCommand({ Bucket: this.bucket, Key: key }),
            { expiresIn },
        );
    }

    async getSignedUrlForWrite(
        key: string,
        expiresIn = 3600,
    ): Promise<string> {
        return getSignedUrl(
            this.s3Client,
            new PutObjectCommand({ Bucket: this.bucket, Key: key }),
            { expiresIn },
        );
    }
}
