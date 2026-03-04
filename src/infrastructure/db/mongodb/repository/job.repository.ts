import type { JobType } from "@/infrastructure/db/mongodb/models/job.schema";
import { JobEntity } from "@/domain/entity/job.entity";
import { BaseRepository } from "./base.repository";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import { JOB_MAPPER } from "@/application/enums/mappers/job-mapper.enum";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Jobs } from "../models";
import { Model } from "mongoose";
import type { IJobPersistenceMapper } from "@/application/interface/mappers/job/job-persistence.mapper";

@Injectable()
export class JobRepository extends BaseRepository<JobEntity, JobType> implements IJobRepository<JobEntity> {
	constructor(
		@InjectModel(Jobs.name) _jobModel: Model<JobType>,
		@Inject(JOB_MAPPER.JOB_PERSISTENCE)
		private readonly _mapper: IJobPersistenceMapper<JobEntity, JobType>,
	) {
		super(_jobModel, _mapper);
	}
}
