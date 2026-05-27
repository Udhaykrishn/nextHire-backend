import { Inject, Injectable } from "@nestjs/common";
import { ICompanyRepository } from "../../../domain/repository/company.repository";

@Injectable()
export class GetCompaniesUseCase {
	constructor(
		@Inject("ICompanyRepository")
		private readonly companyRepository: ICompanyRepository,
	) {}

	async execute(recruiterId: string): Promise<unknown> {
		const companies = await this.companyRepository.findAllByOwnerId(recruiterId);
		return {
			message: "Companies retrieved successfully",
			data: companies,
		};
	}
}
