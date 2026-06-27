import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { IFormRepository } from "@/application/interface/repository/form-repository.interface";
import type { FormConfigEntity } from "@/domain/entity/form-config.entity";
import { FormConfigMapper } from "@/infrastructure/mappers/form-config.mapper";
import { FormConfigDocument } from "../models/form-config.schema";

@Injectable()
export class FormConfigRepository implements IFormRepository {
	constructor(
		@InjectModel(FormConfigDocument.name)
		private readonly formModel: Model<FormConfigDocument>,
	) {}

	async findAll(): Promise<FormConfigEntity[]> {
		const docs = await this.formModel.find().sort({ audience: 1, name: 1 }).exec();
		return docs.map((doc) => FormConfigMapper.toDomain(doc));
	}

	async findByKey(formKey: string): Promise<FormConfigEntity | null> {
		const found = await this.formModel.findOne({ formKey }).exec();
		if (!found) return null;
		return FormConfigMapper.toDomain(found);
	}

	async save(entity: FormConfigEntity): Promise<FormConfigEntity> {
		const created = new this.formModel(FormConfigMapper.toPersistence(entity));
		const saved = await created.save();
		return FormConfigMapper.toDomain(saved);
	}

	async updateByKey(formKey: string, entity: FormConfigEntity): Promise<FormConfigEntity | null> {
		const updated = await this.formModel
			.findOneAndUpdate({ formKey }, { $set: FormConfigMapper.toPersistence(entity) }, { new: true })
			.exec();
		if (!updated) return null;
		return FormConfigMapper.toDomain(updated);
	}
}
