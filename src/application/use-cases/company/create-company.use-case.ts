import { Inject, Injectable } from "@nestjs/common";
import { CreateCompanyDto } from "../../dto/company/create-company.dto";
import { ICompanyRepository } from "../../../domain/repository/company.repository";
import { RecruiterMessage } from "../../../domain/enums/messages/recruiter-message.enum";

@Injectable()
export class CreateCompanyUseCase {
	constructor(
		@Inject("ICompanyRepository")
		private readonly companyRepository: ICompanyRepository,
	) {}

	async execute(recruiterId: string, dto: CreateCompanyDto): Promise<unknown> {
		const newCompany = await this.companyRepository.create({
			...dto,
			ownerId: recruiterId as unknown,
		});

		return {
			message: "Company created successfully",
			data: newCompany,
		};
	}
}
