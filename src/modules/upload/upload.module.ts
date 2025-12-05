import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ConfigModule } from "@nestjs/config";
import { UploadController } from "../../presentation/upload/controllers/upload.controller";
import { UploadImageHandler } from "../../application/upload/commands/upload-image.handler";
import { GetSignedUrlHandler } from "../../application/upload/queries/get-signed-url.handler";
import { S3UploadService } from "../../infrastructure/upload/services/s3-upload.service";
import { UPLOAD_SERVICE } from "../../domain/upload/interfaces/upload-service.interface";

const CommandHandlers = [UploadImageHandler];
const QueryHandlers = [GetSignedUrlHandler];

@Module({
	imports: [CqrsModule, ConfigModule],
	controllers: [UploadController],
	providers: [
		...CommandHandlers,
		...QueryHandlers,
		{
			provide: UPLOAD_SERVICE,
			useClass: S3UploadService,
		},
	],
	exports: [UPLOAD_SERVICE],
})
export class UploadModule {}
