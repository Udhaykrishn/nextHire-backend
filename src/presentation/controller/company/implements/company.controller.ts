import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { CreateCompanyDto } from "../../../application/dto/company/create-company.dto";
import { CreateCompanyUseCase } from "../../../application/use-cases/company/create-company.use-case";
import { GetCompaniesUseCase } from "../../../application/use-cases/company/get-companies.use-case";
import { AuthGuard } from "../../../presentation/guards/auth.guard";
import { Request } from "express";

@Controller("recruiter/company")
@UseGuards(AuthGuard)
export class CompanyController {
	constructor(
		private readonly createCompanyUseCase: CreateCompanyUseCase,
		private readonly getCompaniesUseCase: GetCompaniesUseCase,
	) {}

	@Post()
	async createCompany(@Req() req: Request, @Body() dto: CreateCompanyDto) {
		const recruiterId = (req.user as { sub: string }).sub; // Assuming JWT payload puts ID in sub
		return this.createCompanyUseCase.execute(recruiterId, dto);
	}

	@Get()
	async getCompanies(@Req() req: Request) {
		const recruiterId = (req.user as { sub: string }).sub;
		return this.getCompaniesUseCase.execute(recruiterId);
	}
}
