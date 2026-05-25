import type { ApplicationDocument } from "../models/application.schema";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { BaseRepository } from "./base.repository";
import type { IJobApplicationRepository, JobApplicationReadModel } from "@/application/interface/repository/job-application-repository.interface";
import { JOB_MAPPER } from "@/application/enums/mappers/job-mapper.enum";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Application } from "../models/application.schema";
import { Model } from "mongoose";
import type { IJobApplicationPersistenceMapper } from "@/application/interface/mappers/job/job-application-persistence-mapper.interface";

@Injectable()
export class JobApplicationRepository
	extends BaseRepository<JobApplicationEntity, ApplicationDocument>
	implements IJobApplicationRepository<JobApplicationEntity> {
	constructor(
		@InjectModel(Application.name) private readonly _applicationModel: Model<ApplicationDocument>,
		@Inject(JOB_MAPPER.JOB_APPLICATION_PERSISTENCE)
		readonly _mapper: IJobApplicationPersistenceMapper<JobApplicationEntity, ApplicationDocument>,
	) {
		super(_applicationModel, _mapper);
	}

	async findByUserAndJob(userId: string, jobId: string): Promise<JobApplicationEntity | null> {
		const doc = await this._applicationModel.collection.findOne({ userId: String(userId), jobId: String(jobId) });
		if (!doc) return null;
		return this._mapper.fromMongo(doc as ApplicationDocument);
	}

	async findByUserId(userId: string): Promise<JobApplicationEntity[]> {
		const docs = await this._applicationModel.collection
			.find({ userId: String(userId) })
			.sort({ createdAt: -1 })
			.toArray();
		return Promise.all(docs.map((doc) => this._mapper.fromMongo(doc as ApplicationDocument)));
	}

	async findByJobId(jobId: string): Promise<JobApplicationEntity[]> {
		const docs = await this._applicationModel.collection
			.find({ jobId: String(jobId) })
			.sort({ createdAt: -1 })
			.toArray();

		return Promise.all(docs.map((doc) => this._mapper.fromMongo(doc as ApplicationDocument)));
	}

	async findByJobIdWithPagination(jobId: string, page: number, limit: number): Promise<{ data: JobApplicationEntity[]; total: number }> {
		const skip = (page - 1) * limit;

		const [docs, total] = await Promise.all([
			this._applicationModel.collection
				.find({ jobId: String(jobId) })
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.toArray(),
			this._applicationModel.collection.countDocuments({ jobId: String(jobId) })
		]);

		const entities = await Promise.all(docs.map((doc) => this._mapper.fromMongo(doc as ApplicationDocument)));

		return { data: entities, total };
	}

	async findApplicationsWithCandidateDetails(jobId: string, page: number, limit: number, search?: string, status?: string): Promise<{ data: JobApplicationReadModel[]; total: number }> {
		const skip = (page - 1) * limit;

		const matchStage: any = { jobId: String(jobId) };
		if (status) matchStage.status = status;

		const pipeline: any[] = [
			{ $match: matchStage },
			{
				$addFields: {
					userObjId: { $toObjectId: "$userId" }
				}
			},
			{
				$lookup: {
					from: "users",
					localField: "userObjId",
					foreignField: "_id",
					as: "candidateData"
				}
			},
			{ $unwind: "$candidateData" }
		];

		if (search) {
			pipeline.push({
				$match: {
					"candidateData.name": { $regex: search, $options: "i" }
				}
			});
		}

		const countPipeline = [...pipeline, { $count: "total" }];
		const dataPipeline = [
			...pipeline,
			{ $sort: { createdAt: -1 } },
			{ $skip: skip },
			{ $limit: limit }
		];

		const [countResult, dataResult] = await Promise.all([
			this._applicationModel.aggregate(countPipeline),
			this._applicationModel.aggregate(dataPipeline)
		]);

		const total = countResult[0]?.total || 0;
		const data = dataResult.map((doc: any) => ({
			id: String(doc._id),
			jobId: doc.jobId,
			status: doc.status,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
			candidate: {
				id: String(doc.candidateData._id),
				name: doc.candidateData.name,
				email: doc.candidateData.email,
				phone: doc.candidateData.phone || null,
				profileImage: doc.candidateData.profile_url?.url || null,
				profileImageKey: doc.candidateData.profile_url?.key || null,
				resume: doc.candidateData.resume_url?.url || null,
				resumeKey: doc.candidateData.resume_url?.key || null,
			}
		}));

		return { data, total };
	}
}
