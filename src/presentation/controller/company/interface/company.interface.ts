import { CreateCompanyDto } from "@/application/dto/company/create-company.dto";
import { AuthenticatedRequest } from "@/presentation/interface/request.interface";

export interface ICompanyController {
	createCompany(req: AuthenticatedRequest, dto: CreateCompanyDto): Promise<unknown>;
	getCompanies(req: AuthenticatedRequest): Promise<unknown>;
}
