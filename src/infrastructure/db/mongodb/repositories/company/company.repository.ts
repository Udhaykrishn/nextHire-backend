import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ICompanyRepository } from "../../../../domain/repository/company.repository";
import { CompanyDocument } from "../models/organization.schema";

@Injectable()
export class CompanyRepository implements ICompanyRepository {
	constructor(@InjectModel("Company") private readonly companyModel: Model<CompanyDocument>) {}

	async create(data: unknown): Promise<unknown> {
		const newCompany = new this.companyModel(data);
		return newCompany.save();
	}

	async findAllByOwnerId(ownerId: string): Promise<unknown[]> {
		return this.companyModel.find({ ownerId, isActive: true }).exec();
	}

	async findById(id: string): Promise<unknown> {
		return this.companyModel.findById(id).exec();
	}

	async update(id: string, data: unknown): Promise<unknown> {
		return this.companyModel.findByIdAndUpdate(id, data as object, { new: true }).exec();
	}
}
