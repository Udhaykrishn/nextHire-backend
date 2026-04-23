import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { UpdateRecruiterDto } from "@/application/dto/recruiter/recruiter-update.dto";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RECRUITER_ROLE } from "@/domain/enums/status";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

import type { IS3Service } from "@/infrastructure/services/interface";
import type { FileInfo } from "@/infrastructure/services/implements";

@Injectable()
export class UpdateRecruiterUseCase
	implements IExecutable<{ recruiterId: string; data: UpdateRecruiterDto }, ResponseRecruiterDto>
{
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject("S3_SERVICE")
		private readonly _s3Service: IS3Service<FileInfo, Express.Multer.File>,
	) {}

	async execute({
		recruiterId,
		data,
	}: {
		recruiterId: string;
		data: UpdateRecruiterDto;
	}): Promise<ResponseRecruiterDto> {
		const recruiter = await this._recruiterRepository.findById(recruiterId);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (data.email) {
			recruiter.changeEmail(data.email);
		}
		if (data.name) {
			recruiter.changeName(data.name);
		}
		if (data.phone) {
			recruiter.changePhone(data.phone);
		}
		if (data.GSTIN) {
			recruiter.changeGSTIN(data.GSTIN);
		}
		if (data.CIN) {
			recruiter.changeCIN(data.CIN);
		}
		if (data.website_link) {
			recruiter.changeWebsiteLink(data.website_link);
		}
		if (data.description) {
			recruiter.changeDescription(data.description);
		}
		if (data.category) {
			recruiter.changeCategory(data.category);
		}
		if (data.company_role) {
			recruiter.changeCompanyRole(data.company_role as RECRUITER_ROLE);
		}

		const updatedRecruiter = await this._recruiterRepository.findByIdAndUpdate(recruiterId, recruiter);

		if (!updatedRecruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_UPDATE_FAILED);
		}

		if (updatedRecruiter.profile_url?.key) {
			try {
				const signedUrl = await this._s3Service.getSignedUrlForRead(updatedRecruiter.profile_url.key);
				updatedRecruiter.changeProfileUrl(updatedRecruiter.profile_url.key, signedUrl);
			} catch (error) {
				console.error("Error signing URL:", error);
			}
		}

		return this._recruiterMapper.toResponse(updatedRecruiter);
	}
}
