import { VerifyRecruiterCompanyDto } from "@/application/dto/recruiter/verify-recruiter-company.dto";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { ICompanyVerificationService } from "@/application/interface/services/company-verification-service.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";

@Injectable()
export class VerifyRecruiterCompanyUseCase implements IExecutable<VerifyRecruiterCompanyDto, void> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(RECRUITER_TOKEN.COMPANY_VERIFICATION_SERVICE)
		private readonly _companyVerificationService: ICompanyVerificationService,
	) {}

	async execute(data: VerifyRecruiterCompanyDto): Promise<void> {
		const recruiter = await this._recruiterRepository.findById(data.recruiterId);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		const isValidGSTIN = await this._companyVerificationService.verifyGSTIN(data.GSTIN);
		if (!isValidGSTIN) {
			throw new BadRequestException(RECRUITER_MESSAGES.INVALID_GSTIN);
		}

		const isValidCIN = await this._companyVerificationService.verifyCIN(data.CIN);
		if (!isValidCIN) {
			throw new BadRequestException(RECRUITER_MESSAGES.INVALID_CIN);
		}

		recruiter.changeGSTIN(data.GSTIN);
		recruiter.changeCIN(data.CIN);
		recruiter.verifyCompany();

		await this._recruiterRepository.findByIdAndUpdate(recruiter.id as string, recruiter);
	}
}
