import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { JOB_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { IJobRepository, IUserRepository } from "@/application/interface/repository";
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
	) {}

	async execute(dto: GetJobByIdDto): Promise<JobEntity & { matchScore?: number }> {
		const job = await this._jobRepository.findById(dto.jobId);
		if (!job) {
			throw new NotFoundException("Job not found");
		}

		let user: UserEntity | null = null;

		// If a candidate is requesting, hide unpublished jobs
		if (dto.userRole === ROLES.USER) {
			if (!job.is_published) {
				throw new NotFoundException("Job not found");
			}
			if (dto.userId) {
				user = await this._userRepository.findById(dto.userId);
			}
		}

		const jobWithScore = job as JobEntity & { matchScore?: number };

		if (user) {
			jobWithScore.matchScore = this.calculateMatchScore(user, job);
		} else {
			jobWithScore.matchScore = 0;
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
