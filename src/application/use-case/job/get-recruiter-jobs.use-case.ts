import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository, IJobApplicationRepository } from "@/application/interface/repository";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetRecruiterJobsUseCase implements IExecutable<string, (JobEntity & { stats?: { total: number } })[]> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) {}

	async execute(recruiterId: string): Promise<(JobEntity & { stats?: { total: number } })[]> {
		const jobs = await this._jobRepository.findByRecruiterId(recruiterId);

		const jobsWithStats = await Promise.all(
			jobs.map(async (job) => {
				const applications = await this._jobApplicationRepository.findByJobId(job.id!);
				return Object.assign(job, { stats: { total: applications.length } });
			}),
		);

		return jobsWithStats;
	}
}
