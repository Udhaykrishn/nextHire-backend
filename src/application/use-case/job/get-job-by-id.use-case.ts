import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { JOB_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import type { IJobRepository, IUserRepository } from "@/application/interface/repository";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import { JOB_MESSAGES } from "@/domain/enums/messages";
import { ROLES } from "@/presentation/enums";

export interface GetJobByIdDto {
	jobId: string;
	userId?: string;
	userRole?: string;
}

@Injectable()
export class GetJobByIdUseCase implements IExecutable<GetJobByIdDto, JobEntity & { matchScore?: number }> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) { }

	async execute(dto: GetJobByIdDto): Promise<JobEntity & { matchScore?: number; hasApplied?: boolean; applicationStatus?: string }> {
		const job = await this._jobRepository.findById(dto.jobId);
		if (!job) {
			throw new NotFoundException(JOB_MESSAGES.JOB_NOT_FOUND);
		}

		let user: UserEntity | null = null;

		// If a candidate is requesting, hide unpublished jobs
		if (dto.userRole === ROLES.USER) {
			if (!job.is_published) {
				throw new NotFoundException(JOB_MESSAGES.JOB_NOT_FOUND);
			}
			if (dto.userId) {
				user = await this._userRepository.findById(dto.userId);
			}
		}

		const jobWithScore = job as JobEntity & { matchScore?: number; hasApplied?: boolean; applicationStatus?: string; stats?: any };
		jobWithScore.hasApplied = false;

		if (user) {
			jobWithScore.matchScore = this.calculateMatchScore(user, job);
			const application = await this._jobApplicationRepository.findByUserAndJob(user.id!, job.id!);
			if (application) {
				jobWithScore.hasApplied = true;
				jobWithScore.applicationStatus = application.status;
			}
		} else {
			jobWithScore.matchScore = 0;
		}

		if (dto.userRole === ROLES.ADMIN || dto.userRole === ROLES.RECRUITER) {
			const applications = await this._jobApplicationRepository.findByJobId(job.id!);
			jobWithScore.stats = {
				total: applications.length,
				reviewing: applications.filter((a) => a.status === "REVIEWING").length,
				interviews: applications.filter((a) => ["SHORTLISTED", "INTERVIEWING"].includes(a.status)).length,
				offers: applications.filter((a) => a.status === "HIRED").length,
			};
		}

		return jobWithScore;
	}

	private calculateMatchScore(user: UserEntity, job: JobEntity): number {
		let skillScore = 100;
		if (job.skills && job.skills.length > 0) {
			const jobSkills = job.skills.map((s) => s.trim().toLowerCase());
			const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());
			const matchedSkills = jobSkills.filter((s) => userSkills.includes(s));
			skillScore = (matchedSkills.length / jobSkills.length) * 100;
		}

		let experienceScore = 100;
		const jobMinExp = parseFloat(job.minExperience || "0") || 0;
		if (jobMinExp > 0) {
			const userExp = parseFloat(user.experience || "0") || 0;
			if (userExp >= jobMinExp) {
				experienceScore = 100;
			} else {
				experienceScore = (userExp / jobMinExp) * 100;
			}
		}

		let languageScore = 100;
		if (job.regionalLanguages && job.regionalLanguages.length > 0) {
			const jobLanguages = job.regionalLanguages.map((l) => l.trim().toLowerCase());
			const userLanguages = (user.languages || []).map((l) => l.name.trim().toLowerCase());
			const matchedLanguages = jobLanguages.filter((l) => userLanguages.includes(l));
			languageScore = (matchedLanguages.length / jobLanguages.length) * 100;
		}

		const overallScore = skillScore * 0.6 + experienceScore * 0.3 + languageScore * 0.1;
		return Math.round(overallScore);
	}
}
