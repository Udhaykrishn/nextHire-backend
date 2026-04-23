import type { ApplicationDocument } from "../models/application.schema";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { BaseRepository } from "./base.repository";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import { JOB_MAPPER } from "@/application/enums/mappers/job-mapper.enum";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Application } from "../models/application.schema";
import { Model } from "mongoose";
import type { IJobApplicationPersistenceMapper } from "@/application/interface/mappers/job/job-application-persistence-mapper.interface";

@Injectable()
export class JobApplicationRepository
	extends BaseRepository<JobApplicationEntity, ApplicationDocument>
	implements IJobApplicationRepository<JobApplicationEntity>
{
	constructor(
		@InjectModel(Application.name) private readonly _applicationModel: Model<ApplicationDocument>,
		@Inject(JOB_MAPPER.JOB_APPLICATION_PERSISTENCE)
		readonly _mapper: IJobApplicationPersistenceMapper<JobApplicationEntity, ApplicationDocument>,
	) {
		super(_applicationModel, _mapper);
	}

	async findByUserAndJob(userId: string, jobId: string): Promise<JobApplicationEntity | null> {
		const doc = await this._applicationModel.findOne({ userId, jobId }).exec();
		if (!doc) return null;
		return this._mapper.fromMongo(doc);
	}
}
