import type { ICompanyPresistanceMapper } from "@/application/interface/mappers/company/company-presistance.mapper";
import type { CompanyEntity } from "@/domain/entity/company.entity";
import type { CompanyDocument } from "../db/mongodb/models/organization.schema";
import { CompanyEntity as DomainCompanyEntity } from "@/domain/entity/company.entity";

export class CompanyPresistanceMapper implements ICompanyPresistanceMapper<CompanyEntity, CompanyDocument> {
	toMongo(data: CompanyEntity): CompanyDocument {
		return {
			name: data.name,
			logo_url: data.logo_url,
			website: data.website,
			industry: data.industry,
			company_size: data.company_size,
			location: data.location,
			about: data.about,
			ownerId: data.ownerId as unknown,
			isActive: data.isActive,
		} as CompanyDocument;
	}

	fromMongo(data: CompanyDocument): CompanyEntity {
		return new DomainCompanyEntity({
			id: data._id.toString(),
			name: data.name,
			logo_url: data.logo_url,
			website: data.website,
			industry: data.industry,
			company_size: data.company_size,
			location: data.location,
			about: data.about,
			ownerId: data.ownerId.toString(),
			isActive: data.isActive,
		});
	}
}
