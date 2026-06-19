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

	private buildFilter(pages: PaginationDto): FilterQuery<JobType> {
		const filter: FilterQuery<JobType> = {};
		const andConditions: FilterQuery<JobType>[] = [];

		if (pages.status) filter.status = pages.status;
		if (pages.is_published !== undefined) filter.is_published = pages.is_published;

		if (pages.search) {
			andConditions.push({
				$or: [
					{ jobTitle: { $regex: pages.search, $options: "i" } },
					{ hiringCompany: { $regex: pages.search, $options: "i" } },
					{ jobCategory: { $regex: pages.search, $options: "i" } },
				],
			});
		}

		if (pages.location) {
			andConditions.push({
				$or: [
					{ jobCity: { $regex: pages.location, $options: "i" } },
					{ officeAddress: { $regex: pages.location, $options: "i" } },
					{ locationType: { $regex: pages.location, $options: "i" } },
				],
			});
		}

		if (pages.jobTypes && pages.jobTypes.length > 0) {
			const typeRegexes = pages.jobTypes.map((t) => ({ jobType: { $regex: t, $options: "i" } }));
			andConditions.push({ $or: typeRegexes });
		}

		if (pages.locationTypes && pages.locationTypes.length > 0) {
			const typeRegexes = pages.locationTypes.map((t) => ({ locationType: { $regex: t, $options: "i" } }));
			andConditions.push({ $or: typeRegexes });
		}

		if (pages.experience && pages.experience.length > 0) {
			const expConditions = pages.experience
				.map((exp) => {
					const val = { $convert: { input: "$minExperience", to: "double", onError: 0, onNull: 0 } };
					if (exp === "Entry Level") return { $lte: [val, 1] };
					if (exp === "Mid Level") return { $and: [{ $gt: [val, 1] }, { $lte: [val, 3] }] };
					if (exp === "Senior Level") return { $and: [{ $gt: [val, 3] }, { $lte: [val, 7] }] };
					if (exp === "Director") return { $gt: [val, 7] };
					return null;
				})
				.filter(Boolean);

			if (expConditions.length > 0) {
				andConditions.push({ $expr: { $or: expConditions } });
			}
		}

		if (pages.salary && pages.salary.length > 0) {
			const salConditions = pages.salary
				.map((sal) => {
					const val = { $convert: { input: "$maxSalary", to: "double", onError: 0, onNull: 0 } };
					if (sal === "₹0 - ₹3L") return { $lte: [val, 300000] };
					if (sal === "₹3L - ₹5L") return { $and: [{ $gt: [val, 300000] }, { $lte: [val, 500000] }] };
					if (sal === "₹5L - ₹10L") return { $and: [{ $gt: [val, 500000] }, { $lte: [val, 1000000] }] };
					if (sal === "₹10L+") return { $gt: [val, 1000000] };
					return null;
				})
				.filter(Boolean);

			if (salConditions.length > 0) {
				andConditions.push({ $expr: { $or: salConditions } });
			}
		}

		if (pages.minSalary !== undefined || pages.maxSalary !== undefined) {
			const salConditions: Record<string, unknown>[] = [];
			const val = { $convert: { input: "$maxSalary", to: "double", onError: 0, onNull: 0 } };

			if (pages.minSalary !== undefined && pages.maxSalary !== undefined) {
				salConditions.push({ $and: [{ $gte: [val, pages.minSalary] }, { $lte: [val, pages.maxSalary] }] });
			} else if (pages.minSalary !== undefined) {
				salConditions.push({ $gte: [val, pages.minSalary] });
			} else if (pages.maxSalary !== undefined) {
				salConditions.push({ $lte: [val, pages.maxSalary] });
			}

			if (salConditions.length > 0) {
				andConditions.push({ $expr: { $or: salConditions } });
			}
		}

		if (andConditions.length > 0) {
			filter.$and = andConditions;
		}

		return filter;
	}

	async findAllJobs(pages: PaginationDto): Promise<PaginationResponse<JobEntity> | null> {
		const skip = (pages.page - 1) * pages.limit;
		const filter = this.buildFilter(pages);

		let sortOptions: Record<string, 1 | -1 | { $meta: string }> = { created_at: -1 }; // Default: Newest

		if (pages.sort === "Newest") {
			sortOptions = { created_at: -1 };
		} else if (pages.sort === "Salary (High to Low)") {
			sortOptions = { maxSalary: -1 };
		} else if (pages.sort === "Relevance") {
			if (pages.search) {
				sortOptions = { score: { $meta: "textScore" } };
			}
		}

		let query = this.model.find(filter);

		if (sortOptions.score) {
			query = query.sort(sortOptions);
			// Mongoose needs text index for textScore, assuming it's regex search here, relevance might just be default
			sortOptions = {}; // Reset since we are using regex, not $text in buildFilter
		} else {
			query = query.sort(sortOptions);
		}

		const docs = await query.skip(skip).limit(pages.limit).exec();
		const total = await this.model.countDocuments(filter);
		const page = Math.ceil(total / pages.limit);
		const data = await Promise.all(docs.map((doc) => this.mapper.fromMongo(doc as JobType)));

		return {
			data,
			page: page ?? 0,
			total,
		};
	}

	async findUnpaginatedJobs(pages: PaginationDto): Promise<JobEntity[]> {
		const filter = this.buildFilter(pages);
		const docs = await this.model.find(filter).exec();
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc as JobType)));
	}
}
