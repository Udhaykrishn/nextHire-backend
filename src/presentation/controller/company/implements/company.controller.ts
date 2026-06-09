import { Body, Controller, Get, Inject, Post, Req, UseGuards } from "@nestjs/common";
import type { CreateCompanyDto } from "@/application/dto/company/create-company.dto";
import type { IExecutable } from "@/application/interface/executable.interface";
import { COMPANY_TOKEN } from "@/application/enums/tokens";
import { COMPANY_ROUTERS, ROLES } from "@/presentation/enums";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { ICompanyController } from "../interface/company.interface";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(COMPANY_ROUTERS.ROUTER)
export class CompanyController implements ICompanyController {
	constructor(
		@Inject(COMPANY_TOKEN.CREATE_COMPANY_USE_CASE)
		private readonly _createCompanyUseCase: IExecutable<{ recruiterId: string; dto: CreateCompanyDto }, unknown>,
		@Inject(COMPANY_TOKEN.GET_COMPANIES_USE_CASE)
		private readonly _getCompaniesUseCase: IExecutable<string, unknown>,
	) {}

	@Post(COMPANY_ROUTERS.DEFAULT)
	async createCompany(@Req() req: AuthenticatedRequest, @Body() dto: CreateCompanyDto): Promise<unknown> {
		const recruiterId = req.user.id;
		return this._createCompanyUseCase.execute({ recruiterId, dto });
	}

	@Get(COMPANY_ROUTERS.DEFAULT)
	async getCompanies(@Req() req: AuthenticatedRequest): Promise<unknown> {
		const recruiterId = req.user.id;
		return this._getCompaniesUseCase.execute(recruiterId);
	}
}
