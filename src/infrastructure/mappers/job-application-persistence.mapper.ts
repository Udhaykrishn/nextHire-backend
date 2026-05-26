import type { IJobApplicationPersistenceMapper } from "@/application/interface/mappers/job/job-application-persistence-mapper.interface";
import { JobApplicationEntity, APPLICATION_STATUS } from "@/domain/entity/job-application.entity";
import type { ApplicationType } from "../db/mongodb/models/application.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JobApplicationPersistenceMapper
	implements IJobApplicationPersistenceMapper<JobApplicationEntity, ApplicationType>
{
	toMongo(data: JobApplicationEntity): ApplicationType {
		return {
			_id: data.id as string,
			userId: data.userId,
			jobId: data.jobId,
			status: data.status,
			matchScore: data.matchScore,
			matchBreakdown: data.matchBreakdown,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		};
	}

	async fromMongo(data: ApplicationType): Promise<JobApplicationEntity> {
		return JobApplicationEntity.create({
			id: data._id.toString(),
			userId: data.userId.toString(),
			jobId: data.jobId.toString(),
			status: data.status as APPLICATION_STATUS,
			matchScore: data.matchScore,
			matchBreakdown: data.matchBreakdown,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}
}
