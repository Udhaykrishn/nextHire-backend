import type { JobType } from "@/infrastructure/db/mongodb/models/job.schema";
import { JobEntity } from "@/domain/entity/job.entity";
import { BaseRepository } from "./base.repository";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import { JOB_MAPPER } from "@/application/enums/mappers/job-mapper.enum";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Jobs } from "../models";
import { Model, FilterQuery } from "mongoose";
import type { IJobPersistenceMapper } from "@/application/interface/mappers/job/job-persistence.mapper";
import type { PaginationResponse } from "@/domain/types/paginations";
import type { PaginationDto } from "@/application/dto/pagiation";

@Injectable()
export class JobRepository extends BaseRepository<JobEntity, JobType> implements IJobRepository<JobEntity> {
	constructor(
		@InjectModel(Jobs.name) _jobModel: Model<JobType>,
		@Inject(JOB_MAPPER.JOB_PERSISTENCE) readonly _mapper: IJobPersistenceMapper<JobEntity, JobType>,
	) {
		super(_jobModel, _mapper);
	}

	async findByRecruiterId(recruiterId: string): Promise<JobEntity[]> {
		const jobs = await this.model.find({ company_id: recruiterId }).exec();
		return Promise.all(jobs.map((job) => this.mapper.fromMongo(job as JobType)));
	}

	async findAllJobs(pages: PaginationDto): Promise<PaginationResponse<JobEntity> | null> {
		const skip = (pages.page - 1) * pages.limit;

		const filter: FilterQuery<JobType> = {};

		if (pages.status) {
			filter.status = pages.status;
		}

		if (pages.search) {
			filter.$or = [
				{ jobTitle: { $regex: pages.search, $options: "i" } },
				{ hiringCompany: { $regex: pages.search, $options: "i" } },
				{ jobCategory: { $regex: pages.search, $options: "i" } },
			];
		}

		const docs = await this.model.find(filter).skip(skip).limit(pages.limit).exec();
		const total = await this.model.countDocuments(filter);
		const page = Math.ceil(total / pages.limit);
		const data = await Promise.all(docs.map((doc) => this.mapper.fromMongo(doc as JobType)));

		return {
			data,
			page: page ?? 0,
			total,
		};
	}
}
