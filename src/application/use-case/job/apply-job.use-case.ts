import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MESSAGES } from "@/domain/enums/messages/user-error-message.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IJobRepository } from "@/application/interface/repository/job-repository.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { JobEntity } from "@/domain/entity/job.entity";
import { Inject, Injectable, ForbiddenException, NotFoundException, BadRequestException } from "@nestjs/common";

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
	) {}

	async execute(data: ApplyJobDto): Promise<JobApplicationEntity> {
		const job = await this._jobRepository.findById(data.jobId);
		if (!job) {
			throw new NotFoundException("Job not found");
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
			throw new BadRequestException("You have already applied for this job");
		}

		const application = JobApplicationEntity.create({
			userId: data.userId,
			jobId: data.jobId,
		});

		return await this._jobApplicationRepository.save(application);
	}
}
