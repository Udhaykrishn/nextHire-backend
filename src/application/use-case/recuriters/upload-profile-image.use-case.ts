import { Inject, Injectable } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { RECRUITER_MAPPER } from "@/application/enums";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter/application.mapper";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import type { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { NotFoundException } from "@nestjs/common";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

interface UploadProfileImageInput {
	recruiterId: string;
	file: Express.Multer.File;
}

@Injectable()
export class UploadRecruiterProfileImageUseCase implements IExecutable<UploadProfileImageInput, ResponseRecruiterDto> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _mapper: IRecruiterApplicationMappers<RecruiterEntity>,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute(input: UploadProfileImageInput): Promise<ResponseRecruiterDto> {
		const { recruiterId, file } = input;

		// Find the recruiter
		const recruiter = await this._recruiterRepository.findById(recruiterId);
		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		// Delete old profile image if exists
		if (recruiter.profile_url?.key) {
			try {
				await this._s3Service.deleteFile(recruiter.profile_url.key);
			} catch (error) {
				console.error("Error deleting old profile image:", error);
			}
		}

		// Upload new image to S3
		const fileInfo = await this._s3Service.uploadFile(file);

		// Update recruiter with new profile URL
		const updatedRecruiter = await this._recruiterRepository.findByIdAndUpdate(recruiterId, {
			profile_url: {
				key: fileInfo.key,
				url: fileInfo.url,
			},
		} as Partial<RecruiterEntity>);

		if (!updatedRecruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		return this._mapper.toResponse(updatedRecruiter);
	}
}
