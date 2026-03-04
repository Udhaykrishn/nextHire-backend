import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import type { EducationEntity } from "@/domain/entity/education.entity";
import type { IEducationRepository } from "@/application/interface/repository";
import { Education } from "../models";
import type { Model } from "mongoose";
import { EDUCATION_MAPPER } from "@/application/enums";
import type { IEducationPresistanceMapper } from "@/application/interface/mappers/education/education-presistance.mapper";
import type { EducationType } from "../models/education.schema";

@Injectable()
export class EducationRepository
	extends BaseRepository<EducationEntity, EducationType>
	implements IEducationRepository<EducationEntity>
{
	constructor(
		@InjectModel(Education.name) private educationModel: Model<EducationType>,
		@Inject(EDUCATION_MAPPER.EDUCATION_PERSISTANCE)
		mapper: IEducationPresistanceMapper<EducationEntity, EducationType>,
	) {
		super(educationModel, mapper);
	}

	async findByUserId(userId: string): Promise<EducationEntity[]> {
		const docs = await this.educationModel.find({ userId });
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}
}
