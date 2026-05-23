import type { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages/recruiter-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobEntity } from "@/domain/entity/job.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";

@Injectable()
export class CreateJobUseCase implements IExecutable<CreateJobDto, JobEntity> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(data: CreateJobDto): Promise<JobEntity> {
		if (!data.company_id || !data.posted_by) {
			throw new BadRequestException("Company ID and Posted By are required");
		}

		const recruiter = await this._recruiterRepository.findById(data.company_id);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		if (!recruiter.is_verified_company) {
			throw new ForbiddenException(RECRUITER_MESSAGES.RECRUITER_NOT_VERIFIED);
		}

		// Check subscription limit (1 free job)
		const isSubscribed = recruiter.subscription?.is_subscribed || false;
		const jobCount = recruiter.job_count || 0;

		if (!isSubscribed && jobCount >= 1) {
			throw new ForbiddenException(RECRUITER_MESSAGES.SUBSCRIPTION_REQUIRED);
		}

		const job = JobEntity.create({
			...data,
			company_id: data.company_id,
			posted_by: data.posted_by,
		});

		const savedJob = await this._jobRepository.save(job);

		// Update recruiter job count
		recruiter.incrementJobCount();

		await this._recruiterRepository.findByIdAndUpdate(recruiter.id ?? "", recruiter);

		return savedJob;
	}
}
