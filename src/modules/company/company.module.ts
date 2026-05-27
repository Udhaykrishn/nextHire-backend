import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CompanySchema } from "../../infrastructure/db/mongodb/models/organization.schema";
import { CompanyRepository } from "../../infrastructure/db/mongodb/repositories/company/company.repository";
import { CreateCompanyUseCase } from "../../application/use-cases/company/create-company.use-case";
import { GetCompaniesUseCase } from "../../application/use-cases/company/get-companies.use-case";
import { CompanyController } from "../../presentation/controller/company/implements/company.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [MongooseModule.forFeature([{ name: "Company", schema: CompanySchema }]), JwtModule.register({})],
	controllers: [CompanyController],
	providers: [
		{
			provide: "ICompanyRepository",
			useClass: CompanyRepository,
		},
		CreateCompanyUseCase,
		GetCompaniesUseCase,
	],
	exports: ["ICompanyRepository"],
})
export class CompanyModule {}
