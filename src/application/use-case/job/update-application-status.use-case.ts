import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { JOB_TOKEN } from "@/application/enums/tokens";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { UpdateApplicationStatusDto } from "../../dto/job/update-application-status.dto";

export interface UpdateApplicationStatusPayload {
	dto: UpdateApplicationStatusDto;
	recruiterId: string;
}

@Injectable()
export class UpdateApplicationStatusUseCase implements IExecutable<UpdateApplicationStatusPayload, void> {
	constructor(
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	async execute({ dto, recruiterId }: UpdateApplicationStatusPayload): Promise<void> {
		const application = await this._jobApplicationRepository.findById(dto.applicationId);
		
		if (!application) {
			throw new NotFoundException("Job application not found");
		}

		const job = await this._jobRepository.findById(application.jobId);
		if (!job) {
			throw new NotFoundException("Associated job not found");
		}

		if (job.company_id !== recruiterId) {
			throw new ForbiddenException("You don't have permission to modify this application");
		}

		application.changeStatus(dto.status);
		await this._jobApplicationRepository.findByIdAndUpdate(dto.applicationId, application);
	}
}
