import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { RevokeCompanyVerificationDto } from "@/application/dto/recruiter/revoke-company-verification.dto";

@Injectable()
export class RevokeCompanyVerificationUseCase
	implements IExecutable<{ recruiterId: string; dto: RevokeCompanyVerificationDto }, ResponseRecruiterDto>
{
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute({
		recruiterId,
		dto,
	}: {
		recruiterId: string;
		dto: RevokeCompanyVerificationDto;
	}): Promise<ResponseRecruiterDto> {
		const recruiter = await this._recruiterRepository.findById(recruiterId);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		recruiter.revokeCompanyVerification(dto.reason);

		await this._recruiterRepository.findByIdAndUpdate(recruiter.id as string, recruiter);

		return {
			id: recruiter.id as string,
			email: recruiter.email,
			name: recruiter.name,
			phone: recruiter.phone,
			GSTIN: recruiter.GSTIN,
			CIN: recruiter.CIN,
			status: recruiter.status,
			website_link: recruiter.website_link,
			description: recruiter.description,
			category: recruiter.category,
			company_role: recruiter.company_role,
			is_verified_company: recruiter.is_verified_company,
			verification_revoked_reason: recruiter.verification_revoked_reason,
			admin_approved: recruiter.admin_approved,
			profile_url: recruiter.profile_url,
			subscription: recruiter.subscription,
			job_count: recruiter.job_count,
			createdAt: recruiter.createdAt,
			updatedAt: recruiter.updatedAt,
		};
	}
}
