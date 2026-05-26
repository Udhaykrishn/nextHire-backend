import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MESSAGES } from "@/domain/enums/messages/user-error-message.enum";
import { JOB_MESSAGES } from "@/domain/enums/messages/job-message.enum";
import { APPLICATION_MESSAGES } from "@/domain/enums/messages/application-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { JobEntity } from "@/domain/entity/job.entity";
import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { JOB_EVENTS } from "@/domain/enums/events.enum";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import type { IRecruiterRepository } from "@/application/interface/repository/recruiter-repository.interface";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";

export interface ApplyJobDto {
	userId: string;
	jobId: string;
}

@Injectable()
export class ApplyJobUseCase implements IExecutable<ApplyJobDto, JobApplicationEntity> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
		@InjectQueue("ai-matching-queue")
		private readonly _aiMatchingQueue: Queue,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		private readonly eventEmitter: EventEmitter2,
	) { }

	async execute(data: ApplyJobDto): Promise<JobApplicationEntity> {
		const job = await this._jobRepository.findById(data.jobId);
		if (!job) {
			throw new NotFoundException(JOB_MESSAGES.JOB_NOT_FOUND);
		}

		const user = await this._userRepository.findById(data.userId);
		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (!user.isProfileComplete()) {
			throw new ForbiddenException(USER_MESSAGES.PROFILE_INCOMPLETE);
		}

		const existingApplication = await this._jobApplicationRepository.findByUserAndJob(data.userId, data.jobId);
		if (existingApplication) {
			throw new BadRequestException(APPLICATION_MESSAGES.ALREADY_APPLIED);
		}

		const application = JobApplicationEntity.create({
			userId: data.userId,
			jobId: data.jobId,
			matchScore: 0,
		});

		const savedApplication = await this._jobApplicationRepository.save(application);

		try {
			await this._aiMatchingQueue.add(
				"calculate-score",
				{
					applicationId: savedApplication.id,
					jobId: data.jobId,
					candidateId: data.userId
				},
				{
					attempts: 3,
					backoff: {
						type: "exponential",
						delay: 5000,
					},
					removeOnComplete: true,
				}
			);
		} catch (e) {
			console.error("Failed to push to ai-matching-queue", e);
		}

		const recruiter = await this._recruiterRepository.findById(job.posted_by || job.company_id || "");
		if (recruiter && recruiter.email) {
			this.eventEmitter.emit(JOB_EVENTS.JOB_APPLIED, {
				candidateEmail: user.email,
				candidateName: user.name,
				recruiterEmail: recruiter.email,
				recruiterName: recruiter.name,
				jobTitle: job.jobTitle,
				companyName: job.hiringCompany,
			});
		}

		return savedApplication;

	}
}
