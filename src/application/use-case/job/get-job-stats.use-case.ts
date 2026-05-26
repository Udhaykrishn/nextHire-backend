import { Inject, Injectable } from "@nestjs/common";
import { JOB_TOKEN } from "@/application/enums/tokens";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IExecutable } from "@/application/interface/executable.interface";

export interface JobStatsResponse {
	total: number;
	reviewing: number;
	interviews: number;
	offers: number;
}

@Injectable()
export class GetJobStatsUseCase implements IExecutable<string, JobStatsResponse> {
	constructor(
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) {}

	async execute(jobId: string): Promise<JobStatsResponse> {
		const applications = await this._jobApplicationRepository.findByJobId(jobId);
		
		return {
			total: applications.length,
			reviewing: applications.filter((a) => a.status === "REVIEWING").length,
			interviews: applications.filter((a) => ["SHORTLISTED", "INTERVIEWING"].includes(a.status)).length,
			offers: applications.filter((a) => a.status === "HIRED").length,
		};
	}
}
