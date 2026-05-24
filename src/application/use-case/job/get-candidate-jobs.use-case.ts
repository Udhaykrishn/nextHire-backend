import { Inject, Injectable } from "@nestjs/common";
import { JOB_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { JobEntity } from "@/domain/entity/job.entity";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { IJobRepository, IUserRepository } from "@/application/interface/repository";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";

export interface GetCandidateJobsDto {
	paginationDto: PaginationDto;
	userId?: string;
}

@Injectable()
export class GetCandidateJobsUseCase
	implements IExecutable<GetCandidateJobsDto, PaginationResponse<JobEntity & { matchScore?: number }> | null> {
	constructor(
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
	) { }

	async execute(dto: GetCandidateJobsDto): Promise<PaginationResponse<JobEntity & { matchScore?: number }> | null> {
		const allJobs = await this._jobRepository.findUnpaginatedJobs(dto.paginationDto);
		if (!allJobs) return null;

		let user: UserEntity | null = null;
		if (dto.userId) {
			user = await this._userRepository.findById(dto.userId);
		}

		// Calculate scores and add them
		const dataWithScore = allJobs.map((job) => {
			const jobWithScore = job as JobEntity & { matchScore?: number };
			if (user) {
				jobWithScore.matchScore = this.calculateMatchScore(user, job);
			} else {
				jobWithScore.matchScore = 0;
			}
			return jobWithScore;
		});

		dataWithScore.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

		const page = dto.paginationDto.page || 1;
		const limit = dto.paginationDto.limit || 10;
		const skip = (page - 1) * limit;

		const paginatedData = dataWithScore.slice(skip, skip + limit);
		const total = dataWithScore.length;
		const totalPages = Math.ceil(total / limit);

		return {
			data: paginatedData,
			page: totalPages > 0 ? page : 0,
			total,
		};
	}

	private calculateMatchScore(user: UserEntity, job: JobEntity): number {
		// 1. Technical Skills Match (Weight: 60%)
		let skillScore = 100;
		if (job.skills && job.skills.length > 0) {
			const jobSkills = job.skills.map((s) => s.trim().toLowerCase());
			const userSkills = (user.skills || []).map((s) => s.trim().toLowerCase());
			const matchedSkills = jobSkills.filter((s) => userSkills.includes(s));
			skillScore = (matchedSkills.length / jobSkills.length) * 100;
		}

		// 2. Experience Match (Weight: 30%)
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

		// 3. Languages Match (Weight: 10%)
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
