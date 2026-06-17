import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import type { IPlanRepository } from "@/application/interface/repository/plan-repository.interface";
import type { PlanEntity } from "@/domain/entity/plan.entity";
import { PlanDocument } from "../models/plan.schema";
import { PlanMapper } from "@/infrastructure/mappers/plan.mapper";

@Injectable()
export class PlanRepository implements IPlanRepository {
	constructor(
		@InjectModel(PlanDocument.name)
		private readonly planModel: Model<PlanDocument>,
	) {}

	async save(entity: PlanEntity): Promise<PlanEntity> {
		const created = new this.planModel(PlanMapper.toPersistence(entity));
		const saved = await created.save();
		return PlanMapper.toDomain(saved);
	}

	async findById(id: string): Promise<PlanEntity | null> {
		const found = await this.planModel.findById(id).exec();
		if (!found) return null;
		return PlanMapper.toDomain(found);
	}

	async findAll(): Promise<PlanEntity[]> {
		const plans = await this.planModel.find().exec();
		return plans.map((p) => PlanMapper.toDomain(p));
	}

	async findByType(type: "candidate" | "recruiter"): Promise<PlanEntity[]> {
		const plans = await this.planModel.find({ type }).exec();
		return plans.map((p) => PlanMapper.toDomain(p));
	}

	async findOne(data: Partial<PlanEntity>): Promise<PlanEntity | null> {
		// Use type assertion since PlanEntity keys match schema properties mostly
		const found = await this.planModel.findOne(data as Record<string, unknown>).exec();
		if (!found) return null;
		return PlanMapper.toDomain(found);
	}

	async deleteById(id: string): Promise<boolean> {
		const result = await this.planModel.findByIdAndDelete(id).exec();
		return result !== null;
	}

	async findByIdAndUpdate(id: string, update: Partial<PlanEntity>): Promise<PlanEntity | null> {
		const updated = await this.planModel.findByIdAndUpdate(id, { $set: update }, { new: true }).exec();
		if (!updated) return null;
		return PlanMapper.toDomain(updated);
	}

	async findByUniqueFields(fields: Partial<PlanEntity>): Promise<PlanEntity | null> {
		return this.findOne(fields);
	}
}
