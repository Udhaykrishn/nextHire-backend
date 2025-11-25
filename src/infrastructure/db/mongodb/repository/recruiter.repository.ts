import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import type { PaginationDto } from "@/application/dto/pagiation";
import { RecruiterEntity } from "@/domain/entity";
import { Model } from "mongoose";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { PaginationResponse } from "@/domain/types/paginations";
import { Recruiter, RecruiterType } from "../models";
import { RECRUITER_MAPPER } from "@/application/enums/recruiter";
import type { IRecruiterPresitanceMapper } from "@/application/interface/mappers/recruiter";

@Injectable()
export class RecruiterRepository
	extends BaseRepository<RecruiterEntity, RecruiterType>
	implements IRecruiterRepository<RecruiterEntity>
{
	constructor(
		@InjectModel(Recruiter.name) private recruiterModel: Model<RecruiterType>,
		@Inject(RECRUITER_MAPPER.RECRUITER_PRESISTANCE)
		recruiterPresistanceMapper: IRecruiterPresitanceMapper<
			RecruiterEntity,
			RecruiterType
		>,
	) {
		super(recruiterModel, recruiterPresistanceMapper);
	}

	async findAllRecruiters(
		pages: PaginationDto,
	): Promise<PaginationResponse<RecruiterEntity> | null> {
		const skip = (pages.page - 1) * pages.limit;

		const docs = await this.recruiterModel
			.find()
			.skip(skip)
			.limit(pages.limit)
			.exec();

		const total = await this.recruiterModel.countDocuments();

		const data = await Promise.all(
			docs.map((doc) => this.mapper.fromMongo(doc)),
		);

		return {
			data,
			page: pages.page,
			total,
		};
	}
}
