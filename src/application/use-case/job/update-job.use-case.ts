import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JOB_TOKEN } from "@/application/enums/tokens";
import type { IJobRepository } from "@/application/interface/repository";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { UpdateJobDto } from "@/application/dto/job/update-job.dto";
import { JOB_MESSAGES } from "@/domain/enums/messages";

export interface UpdateJobInput {
	jobId: string;
	dto: UpdateJobDto;
}

@Injectable()
export class UpdateJobUseCase implements IExecutable<UpdateJobInput, JobEntity> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	async execute(input: UpdateJobInput): Promise<JobEntity> {
		const job = await this._jobRepository.findByIdAndUpdate(input.jobId, input.dto);
		if (!job) {
			throw new NotFoundException(JOB_MESSAGES.JOB_NOT_FOUND);
		}
		return job;
	}
}
