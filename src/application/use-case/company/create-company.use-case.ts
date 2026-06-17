import { Inject, Injectable } from "@nestjs/common";
import type { CreateCompanyDto } from "@/application/dto/company/create-company.dto";
import type { ICompanyRepository } from "@/application/interface/repository";
import type { IExecutable } from "@/application/interface/executable.interface";
import { COMPANY_TOKEN } from "@/application/enums/tokens";

@Injectable()
export class CreateCompanyUseCase implements IExecutable<{ recruiterId: string; dto: CreateCompanyDto }, unknown> {
	constructor(
		@Inject(COMPANY_TOKEN.COMPANY_REPOSITORY)
		private readonly companyRepository: ICompanyRepository,
	) {}

	async execute(payload: { recruiterId: string; dto: CreateCompanyDto }): Promise<unknown> {
		const newCompany = await this.companyRepository.create({
			...payload.dto,
			ownerId: payload.recruiterId as unknown,
		});

		return newCompany;
	}
}
