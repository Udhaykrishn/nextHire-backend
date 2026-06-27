import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import { JOB_MESSAGES } from "@/domain/enums/messages";
import { JOB_STATUS } from "@/domain/enums/status";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ADMIN_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class BlockUnblockJobUseCase implements IExecutable<string, JobEntity> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async execute(jobId: string): Promise<JobEntity> {
		const job = await this._jobRepository.findById(jobId);

		if (!job) {
			throw new NotFoundException(JOB_MESSAGES.JOB_NOT_FOUND);
		}

		const newStatus = job.status === JOB_STATUS.OPEN ? JOB_STATUS.BLOCKED : JOB_STATUS.OPEN;
		job.changeStatus(newStatus);

		const updatedJob = await this._jobRepository.findByIdAndUpdate(jobId, {
			status: newStatus,
		});

		if (!updatedJob) {
			throw new NotFoundException("Job status update failed");
		}

		this.eventEmitter.emit(ADMIN_EVENTS.JOB_BLOCKED_UNBLOCKED, {
			jobId: updatedJob.id,
			status: updatedJob.status,
			jobTitle: updatedJob.jobTitle,
			recruiterId: updatedJob.posted_by || updatedJob.company_id,
		});

		return updatedJob;
	}
}
