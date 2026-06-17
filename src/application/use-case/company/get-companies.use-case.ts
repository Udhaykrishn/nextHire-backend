import { Inject, Injectable, BadRequestException, InternalServerErrorException } from "@nestjs/common";
import type { ICompanyRepository } from "@/application/interface/repository";
import { IExecutable } from "@/application/interface/executable.interface";
import { COMPANY_TOKEN } from "@/application/enums/tokens";
import { COMPANY_MESSAGES } from "@/domain/enums/messages";

@Injectable()
export class GetCompaniesUseCase implements IExecutable<string, unknown> {
	constructor(
		@Inject(COMPANY_TOKEN.COMPANY_REPOSITORY)
		private readonly companyRepository: ICompanyRepository,
	) {}

	async execute(recruiterId: string): Promise<unknown> {
		try {
			if (!recruiterId) {
				throw new BadRequestException(COMPANY_MESSAGES.RECRUITER_ID_REQUIRED);
			}
			const companies = await this.companyRepository.findAllByOwnerId(recruiterId);
			return companies;
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Unknown error";
			throw new InternalServerErrorException(`${COMPANY_MESSAGES.FETCH_FAILED}: ${errorMessage}`);
		}
	}
}
