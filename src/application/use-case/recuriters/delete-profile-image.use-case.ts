import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

@Injectable()
export class DeleteRecruiterProfileImageUseCase implements IExecutable<string, { message: string }> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute(recruiterId: string): Promise<{ message: string }> {
		const recruiter = await this._recruiterRepository.findById(recruiterId);
		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (recruiter.profile_url?.key) {
			try {
				await this._s3Service.deleteFile(recruiter.profile_url.key);
			} catch (error) {
				console.error("Error deleting old profile image:", error);
			}
		}

		const updatedRecruiter = await this._recruiterRepository.findByIdAndUpdate(recruiterId, {
			profile_url: {
				key: "",
				url: "",
			},
		} as Partial<RecruiterEntity>);

		if (!updatedRecruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		return { message: "Profile image deleted successfully" };
	}
}
