import type { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import { JOB_MESSAGES } from "@/domain/enums/messages/job-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JOB_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class CreateJobUseCase implements IExecutable<CreateJobDto, JobEntity> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async execute(data: CreateJobDto): Promise<JobEntity> {
		if (!data.company_id || !data.posted_by) {
			throw new BadRequestException(JOB_MESSAGES.COMPANY_ID_AND_POSTED_BY_REQUIRED);
		}

		const recruiter = await this._recruiterRepository.findById(data.company_id);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (!recruiter.is_verified_company) {
			throw new ForbiddenException(RECRUITER_MESSAGES.RECRUITER_NOT_VERIFIED);
		}

		const job = JobEntity.create({
			...data,
			company_id: data.company_id,
			posted_by: data.posted_by,
			companyLogo: recruiter.profile_url?.url || "",
		});

		const savedJob = await this._jobRepository.save(job);

		recruiter.incrementJobCount();

		await this._recruiterRepository.findByIdAndUpdate(recruiter.id ?? "", recruiter);

		this.eventEmitter.emit(JOB_EVENTS.JOB_CREATED, {
			email: recruiter.email,
			name: recruiter.name,
			jobTitle: job.jobTitle,
			companyName: recruiter.name,
		});

		return savedJob;
	}
}
