import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { StartVerificationSessionDto } from "@/application/dto/recruiter/verification-session.dto";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { ICompanyVerificationService } from "@/application/interface/services/company-verification-service.interface";
import type { ISessionVerificationService } from "@/infrastructure/services/interface";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";

@Injectable()
export class StartVerificationSessionUseCase
	implements IExecutable<{ recruiterId: string; dto: StartVerificationSessionDto }, { message: string; otp?: string }>
{
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(RECRUITER_TOKEN.COMPANY_VERIFICATION_SERVICE)
		private readonly _companyVerificationService: ICompanyVerificationService,
		@Inject(COMMON_TOKEN.SESSION_VERIFICATION_SERVICE)
		private readonly _sessionVerificationService: ISessionVerificationService,
	) {}

	async execute({
		recruiterId,
		dto,
	}: {
		recruiterId: string;
		dto: StartVerificationSessionDto;
	}): Promise<{ message: string; otp?: string }> {
		const recruiter = await this._recruiterRepository.findById(recruiterId);
		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (recruiter.is_verified_company) {
			throw new BadRequestException("Company is already verified.");
		}

		const isValidCIN = await this._companyVerificationService.verifyCIN(dto.CIN);
		if (!isValidCIN) {
			throw new BadRequestException(RECRUITER_MESSAGES.INVALID_CIN);
		}

		const { otp } = await this._sessionVerificationService.startSession(
			recruiterId,
			"COMPANY_CIN",
			recruiter.email,
			recruiter.name,
			{ cin: dto.CIN },
		);

		return {
			message: "Verification OTP sent successfully",
			otp, // Returning OTP for development/testing purposes
		};
	}
}
