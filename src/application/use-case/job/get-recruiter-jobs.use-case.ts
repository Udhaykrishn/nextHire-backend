import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository, IJobApplicationRepository } from "@/application/interface/repository";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { Inject, Injectable } from "@nestjs/common";
import type { PaginationResponse } from "@/domain/types/paginations";

@Injectable()
export class GetRecruiterJobsUseCase
	implements
		IExecutable<
			{ recruiterId: string; page?: number; limit?: number },
			PaginationResponse<JobEntity & { stats?: { total: number; interviews: number } }>
		>
{
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) {}

	async execute(dto: { recruiterId: string; page?: number; limit?: number }) {
		const { recruiterId, page = 1, limit = 10 } = dto;
		const result = await this._jobRepository.findByRecruiterId(recruiterId, page, limit);

		const jobsWithStats = await Promise.all(
			result.data.map(async (job) => {
				const applications = await this._jobApplicationRepository.findByJobId(job.id!);
				return Object.assign(job, {
					stats: {
						total: applications.length,
						interviews: applications.filter((a) => ["SHORTLISTED", "INTERVIEWING"].includes(a.status))
							.length,
					},
				});
			}),
		);

		return {
			data: jobsWithStats,
			page: result.page,
			total: result.total,
			limit: result.limit,
			totalPages: result.totalPages,
		};
	}
}
