import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompanySchema } from "../../infrastructure/db/mongodb/models/organization.schema";
import { CompanyRepository } from "../../infrastructure/db/mongodb/repositories/company/company.repository";
import { CreateCompanyUseCase } from "../../application/use-cases/company/create-company.use-case";
import { GetCompaniesUseCase } from "../../application/use-cases/company/get-companies.use-case";
import { CompanyController } from "../../presentation/controller/company/implements/company.controller";
import { COMPANY_TOKEN } from "../../application/enums/tokens";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [MongooseModule.forFeature([{ name: "Company", schema: CompanySchema }]), JwtModule.register({})],
	controllers: [CompanyController],
	providers: [
		{
			provide: COMPANY_TOKEN.COMPANY_REPOSITORY,
			useClass: CompanyRepository,
		},
		{
			provide: COMPANY_TOKEN.CREATE_COMPANY_USE_CASE,
			useClass: CreateCompanyUseCase,
		},
		{
			provide: COMPANY_TOKEN.GET_COMPANIES_USE_CASE,
			useClass: GetCompaniesUseCase,
		},
	],
	exports: [COMPANY_TOKEN.COMPANY_REPOSITORY],
})
export class CompanyModule {}
