import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { JOB_TOKEN } from "@/application/enums/tokens";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { BulkUpdateApplicationStatusDto } from "../../dto/job/bulk-update-application-status.dto";

export interface BulkUpdateApplicationStatusPayload {
	dto: BulkUpdateApplicationStatusDto;
	recruiterId: string;
}

@Injectable()
export class BulkUpdateApplicationStatusUseCase implements IExecutable<BulkUpdateApplicationStatusPayload, void> {
	constructor(
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	async execute({ dto, recruiterId }: BulkUpdateApplicationStatusPayload): Promise<void> {
		if (dto.applicationIds.length === 0) return;

		// Since we need to verify permission, let's fetch all applications
		const applications: JobApplicationEntity[] = [];
		for (const id of dto.applicationIds) {
			const app = await this._jobApplicationRepository.findById(id);
			if (app) applications.push(app);
		}

		if (applications.length === 0) {
			throw new NotFoundException("No valid job applications found");
		}

		// Verify recruiter has permission for all these applications
		// We'll group by jobId to minimize job fetches
		const jobIds = [...new Set(applications.map(app => app.jobId))];
		const jobs: JobEntity[] = [];
		for (const jobId of jobIds) {
			const job = await this._jobRepository.findById(jobId);
			if (job) jobs.push(job);
		}

		for (const job of jobs) {
			if (job.company_id !== recruiterId) {
				throw new ForbiddenException("You don't have permission to modify some of these applications");
			}
		}

		// Update all statuses
		for (const application of applications) {
			application.changeStatus(dto.status);
			await this._jobApplicationRepository.findByIdAndUpdate(application.id as string, application);
		}
	}
}
