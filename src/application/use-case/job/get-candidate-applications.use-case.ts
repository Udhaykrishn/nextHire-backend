import { Inject, Injectable } from "@nestjs/common";
import { JOB_TOKEN } from "@/application/enums/tokens";
import type { IJobApplicationRepository, IJobRepository } from "@/application/interface/repository";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { IExecutable } from "@/application/interface/executable.interface";

export type JobApplicationWithJob = {
	application: JobApplicationEntity;
	job: JobEntity;
};

export interface GetCandidateApplicationsDto {
	userId: string;
	search?: string;
	status?: string;
}

export interface GetCandidateApplicationsResponse {
	data: JobApplicationWithJob[];
	stats: {
		total: number;
		reviewing: number;
		interviews: number;
		offers: number;
	};
}

@Injectable()
export class GetCandidateApplicationsUseCase
	implements IExecutable<GetCandidateApplicationsDto, GetCandidateApplicationsResponse>
{
	constructor(
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	async execute(dto: GetCandidateApplicationsDto): Promise<GetCandidateApplicationsResponse> {
		const { userId, search, status } = dto;
		const applications = await this._jobApplicationRepository.findByUserId(userId);

		const filteredBySearch: JobApplicationWithJob[] = [];
		for (const app of applications) {
			const job = await this._jobRepository.findById(app.jobId);
			if (job) {
				if (search?.trim()) {
					const query = search.toLowerCase();
					const matchesCompany = job.hiringCompany?.toLowerCase().includes(query);
					const matchesRole = job.jobTitle?.toLowerCase().includes(query);
					if (!matchesCompany && !matchesRole) continue;
				}
				filteredBySearch.push({ application: app, job });
			}
		}

		// Calculate stats based on search results
		const stats = {
			total: filteredBySearch.length,
			reviewing: filteredBySearch.filter((a) => a.application.status === "REVIEWING").length,
			interviews: filteredBySearch.filter((a) => ["SHORTLISTED", "INTERVIEWING"].includes(a.application.status))
				.length,
			offers: filteredBySearch.filter((a) => a.application.status === "HIRED").length,
		};

		// Apply status filter
		const data = filteredBySearch.filter((a) => {
			if (!status || status === "ALL") return true;
			if (status === "INTERVIEWS") return ["SHORTLISTED", "INTERVIEWING"].includes(a.application.status);
			if (status === "OFFERS") return a.application.status === "HIRED";
			if (status === "REVIEWING") return a.application.status === "REVIEWING";
			return true;
		});

		return { data, stats };
	}
}
