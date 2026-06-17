import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { VerifyOtpDto } from "@/application/dto/recruiter/verification-session.dto";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { ISessionVerificationService } from "@/infrastructure/services/interface/session-verification-service.interface";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";

@Injectable()
export class VerifyOtpSessionUseCase implements IExecutable<{ recruiterId: string; dto: VerifyOtpDto }, void> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(COMMON_TOKEN.SESSION_VERIFICATION_SERVICE)
		private readonly _sessionVerificationService: ISessionVerificationService,
	) {}

	async execute({ recruiterId, dto }: { recruiterId: string; dto: VerifyOtpDto }): Promise<void> {
		const recruiter = await this._recruiterRepository.findById(recruiterId);
		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (recruiter.is_verified_company) {
			throw new BadRequestException("Company is already verified.");
		}

		const sessionData = await this._sessionVerificationService.verifySession(recruiterId, "COMPANY_CIN", dto.otp);

		// Update recruiter verified status
		recruiter.changeCIN(sessionData.cin as string);
		recruiter.verifyCompany();

		await this._recruiterRepository.findByIdAndUpdate(recruiter.id as string, recruiter);

		// Clean up Redis session
		await this._sessionVerificationService.deleteSession(recruiterId, "COMPANY_CIN");
	}
}
