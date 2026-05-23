import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Req,
	UseGuards,
	Query,
	ParseIntPipe,
	Patch,
	NotFoundException,
} from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard, RoleGuard, PermissionGuard } from "@/presentation/guards";
import { Permissions, Roles } from "@/presentation/decorators";
import { JOB_ROUTERS } from "@/presentation/enums/job-router.enum";
import { JOB_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import { PERMISSION } from "@/domain/enums";
import { ROLES } from "@/presentation/enums";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JobEntity } from "@/domain/entity/job.entity";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { ApplyJobDto } from "@/application/use-case/job/apply-job.use-case";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";
import { IJobController } from "../interface/job.interface";
import type { IUserRepository, IJobRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";

@UseGuards(AuthGuard, RoleGuard, PermissionGuard)
@Controller(JOB_ROUTERS.ROUTER)
export class JobController implements IJobController {
	constructor(
		@Inject(JOB_TOKEN.CREATE_JOB_USE_CASE)
		private readonly _createJobUseCase: IExecutable<CreateJobDto, JobEntity>,
		@Inject(JOB_TOKEN.APPLY_JOB_USE_CASE)
		private readonly _applyJobUseCase: IExecutable<ApplyJobDto, JobApplicationEntity>,
		@Inject(JOB_TOKEN.GET_RECRUITER_JOBS_USE_CASE)
		private readonly _getRecruiterJobsUseCase: IExecutable<string, JobEntity[]>,
		@Inject(JOB_TOKEN.GET_ALL_JOBS_USE_CASE)
		private readonly _getAllJobsUseCase: IExecutable<PaginationDto, PaginationResponse<JobEntity> | null>,
		@Inject(JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE)
		private readonly _blockUnblockJobUseCase: IExecutable<string, JobEntity>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(JOB_TOKEN.JOB_REPOSITORY)
		private readonly _jobRepository: IJobRepository<JobEntity>,
	) {}

	@Post(JOB_ROUTERS.DEFAULT)
	@Permissions(PERMISSION.JOB_CREATE)
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto): Promise<JobEntity> {
		// Ensure the company_id is set to the current user's ID (recruiter)
		dto.company_id = req.user.id;
		dto.posted_by = req.user.id;
		return this._createJobUseCase.execute(dto);
	}

	@Post(`${JOB_ROUTERS.APPLY}/:${JOB_ROUTERS.ID_PARAM}`)
	@Permissions(PERMISSION.APPLICATION_CREATE)
	@HttpCode(HttpStatus.CREATED)
	async apply(
		@Req() req: AuthenticatedRequest,
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
	): Promise<JobApplicationEntity> {
		return this._applyJobUseCase.execute({ userId: req.user.id, jobId });
	}

	@Get(JOB_ROUTERS.RECRUITER)
	@Permissions(PERMISSION.JOB_CREATE)
	async getRecruiterJobs(@Req() req: AuthenticatedRequest): Promise<JobEntity[]> {
		return this._getRecruiterJobsUseCase.execute(req.user.id);
	}

	@Get(`${JOB_ROUTERS.RECRUITER}/:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getJobsByRecruiterId(@Param(JOB_ROUTERS.ID_PARAM) recruiterId: string): Promise<JobEntity[]> {
		return this._getRecruiterJobsUseCase.execute(recruiterId);
	}

	@Get(JOB_ROUTERS.ALL)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getAllJobs(
		@Query("search") search?: string,
		@Query("page", ParseIntPipe) page: number = 1,
		@Query("limit", ParseIntPipe) limit: number = 10,
		@Query("status") status?: string,
	): Promise<PaginationResponse<JobEntity> | null> {
		const paginationDto: PaginationDto = {
			search,
			page,
			limit,
			status,
		};
		return this._getAllJobsUseCase.execute(paginationDto);
	}

	@Patch(JOB_ROUTERS.BLOCK)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async blockUnblockJob(@Param(JOB_ROUTERS.ID_PARAM) jobId: string): Promise<JobEntity> {
		return this._blockUnblockJobUseCase.execute(jobId);
	}

	@Get(JOB_ROUTERS.DEFAULT)
	@Permissions(PERMISSION.JOB_READ)
	@HttpCode(HttpStatus.OK)
	async getJobsForCandidate(
		@Req() req: AuthenticatedRequest,
		@Query("search") search?: string,
		@Query("page", ParseIntPipe) page: number = 1,
		@Query("limit", ParseIntPipe) limit: number = 10,
	): Promise<PaginationResponse<JobEntity & { matchScore?: number }> | null> {
		const paginationDto: PaginationDto = {
			search,
			page,
			limit,
			status: "OPEN",
		};
		const paginationResult = await this._getAllJobsUseCase.execute(paginationDto);
		if (!paginationResult) return null;

		let user: UserEntity | null = null;
		if (req.user && req.user.role === "USER") {
			user = await this._userRepository.findById(req.user.id);
		}

		const dataWithScore = paginationResult.data.map((job) => {
			const jobWithScore = job as JobEntity & { matchScore?: number };
			if (user) {
				jobWithScore.matchScore = this.calculateMatchScore(user, job);
			} else {
				jobWithScore.matchScore = 0;
			}
			return jobWithScore;
		});

		return {
			...paginationResult,
			data: dataWithScore,
		};
	}

	@Get(`:${JOB_ROUTERS.ID_PARAM}`)
	@Permissions(PERMISSION.JOB_READ)
	@HttpCode(HttpStatus.OK)
	async getJobById(
		@Req() req: AuthenticatedRequest,
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
	): Promise<(JobEntity & { matchScore?: number }) | null> {
		const job = await this._jobRepository.findById(jobId);
		if (!job) {
			throw new NotFoundException("Job not found");
		}

		let user: UserEntity | null = null;
		if (req.user && req.user.role === "USER") {
			user = await this._userRepository.findById(req.user.id);
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
