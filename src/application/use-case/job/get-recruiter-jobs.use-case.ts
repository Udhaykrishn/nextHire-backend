import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetRecruiterJobsUseCase implements IExecutable<string, JobEntity[]> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	async execute(recruiterId: string): Promise<JobEntity[]> {
		return this._jobRepository.findByRecruiterId(recruiterId);
	}
}
