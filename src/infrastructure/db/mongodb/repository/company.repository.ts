import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { ICompanyRepository } from "@/application/interface/repository";
import type { CompanyDocument } from "@/infrastructure/db/mongodb/models/organization.schema";
import { BaseRepository } from "./base.repository";
import type { CompanyEntity } from "@/domain/entity/company.entity";
import { COMPANY_MAPPER } from "@/application/enums/mappers/company-mapper.enum";
import type { ICompanyPresistanceMapper } from "@/application/interface/mappers/company/company-presistance.mapper";

@Injectable()
export class CompanyRepository
	extends BaseRepository<CompanyEntity, CompanyDocument>
	implements ICompanyRepository<CompanyEntity>
{
	constructor(
		@InjectModel("Company") private readonly companyModel: Model<CompanyDocument>,
		@Inject(COMPANY_MAPPER.COMPANY_PERSISTANCE)
		mapper: ICompanyPresistanceMapper<CompanyEntity, CompanyDocument>,
	) {
		super(companyModel, mapper);
	}

	async findAllByOwnerId(ownerId: string): Promise<CompanyEntity[]> {
		const docs = await this.companyModel.find({ ownerId, isActive: true }).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}

	async create(data: unknown): Promise<CompanyEntity> {
		return this.save(data as CompanyEntity);
	}

	async update(id: string, data: unknown): Promise<CompanyEntity | null> {
		return this.findByIdAndUpdate(id, data as object);
	}
}
