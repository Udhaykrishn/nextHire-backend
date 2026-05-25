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
	Patch,
} from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard, RoleGuard, PermissionGuard } from "@/presentation/guards";
import { Roles, Public } from "@/presentation/decorators";
import { JOB_ROUTERS } from "@/presentation/enums/job-router.enum";
import { JOB_TOKEN } from "@/application/enums/tokens";
import { ROLES } from "@/presentation/enums";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { UpdateJobDto } from "@/application/dto/job/update-job.dto";
import { JobEntity } from "@/domain/entity/job.entity";
import { toJobResponse, toJobResponseWithScore } from "@/presentation/mappers/job-response.mapper";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { ApplyJobDto } from "@/application/use-case/job/apply-job.use-case";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";
import { IJobController } from "../interface/job.interface";
import type { GetCandidateJobsDto } from "@/application/use-case/job/get-candidate-jobs.use-case";
import type { GetJobByIdDto } from "@/application/use-case/job/get-job-by-id.use-case";
import type { GetCandidateApplicationsDto, GetCandidateApplicationsResponse } from "@/application/use-case/job/get-candidate-applications.use-case";
import type { JobStatsResponse } from "@/application/use-case/job/get-job-stats.use-case";
import type { GetJobApplicationsDto, JobApplicationResponse } from "@/application/use-case/job/get-job-applications.use-case";

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
		@Inject(JOB_TOKEN.GET_CANDIDATE_JOBS_USE_CASE)
		private readonly _getCandidateJobsUseCase: IExecutable<GetCandidateJobsDto, PaginationResponse<JobEntity & { matchScore?: number }> | null>,
		@Inject(JOB_TOKEN.GET_JOB_BY_ID_USE_CASE)
		private readonly _getJobByIdUseCase: IExecutable<GetJobByIdDto, JobEntity & { matchScore?: number }>,
		@Inject(JOB_TOKEN.GET_CANDIDATE_APPLICATIONS_USE_CASE)
		private readonly _getCandidateApplicationsUseCase: IExecutable<GetCandidateApplicationsDto, GetCandidateApplicationsResponse>,
		@Inject(JOB_TOKEN.GET_JOB_STATS_USE_CASE)
		private readonly _getJobStatsUseCase: IExecutable<string, JobStatsResponse>,
		@Inject(JOB_TOKEN.GET_JOB_APPLICATIONS_USE_CASE)
		private readonly _getJobApplicationsUseCase: IExecutable<GetJobApplicationsDto, PaginationResponse<JobApplicationResponse>>,
		@Inject(JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE)
		private readonly _blockUnblockJobUseCase: IExecutable<string, JobEntity>,
		@Inject(JOB_TOKEN.UPDATE_JOB_USE_CASE)
		private readonly _updateJobUseCase: IExecutable<{ jobId: string; dto: UpdateJobDto }, JobEntity>,
	) { }

	@Post(JOB_ROUTERS.DEFAULT)
	@Roles(ROLES.RECRUITER)
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto) {
		dto.company_id = req.user.id;
		dto.posted_by = req.user.id;
		const job = await this._createJobUseCase.execute(dto);
		return toJobResponse(job);
	}

	@Post(`${JOB_ROUTERS.APPLY}/:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.USER)
	@HttpCode(HttpStatus.CREATED)
	async apply(
		@Req() req: AuthenticatedRequest,
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
	): Promise<JobApplicationEntity> {
		return this._applyJobUseCase.execute({ userId: req.user.id, jobId });
	}

	@Get(JOB_ROUTERS.RECRUITER)
	@Roles(ROLES.RECRUITER)
	async getRecruiterJobs(@Req() req: AuthenticatedRequest) {
		const jobs = await this._getRecruiterJobsUseCase.execute(req.user.id);
		return jobs.map((job) => toJobResponse(job));
	}

	@Get(`${JOB_ROUTERS.RECRUITER}/:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getJobsByRecruiterId(@Param(JOB_ROUTERS.ID_PARAM) recruiterId: string) {
		const jobs = await this._getRecruiterJobsUseCase.execute(recruiterId);
		return jobs.map((job) => toJobResponse(job));
	}

	@Get(JOB_ROUTERS.ALL)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getAllJobs(
		@Query("search") search?: string,
		@Query("page") page: string = "1",
		@Query("limit") limit: string = "10",
		@Query("status") status?: string,
	) {
		const paginationDto: PaginationDto = {
			search,
			page: parseInt(page, 10) || 1,
			limit: parseInt(limit, 10) || 10,
			status,
		};
		const result = await this._getAllJobsUseCase.execute(paginationDto);
		if (!result) return null;
		return {
			...result,
			data: result.data.map((job) => toJobResponse(job)),
		};
	}

	@Patch(JOB_ROUTERS.BLOCK)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async blockUnblockJob(@Param(JOB_ROUTERS.ID_PARAM) jobId: string) {
		const job = await this._blockUnblockJobUseCase.execute(jobId);
		return toJobResponse(job);
	}

	@Patch(`:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async updateJob(@Param(JOB_ROUTERS.ID_PARAM) jobId: string, @Body() dto: UpdateJobDto) {
		const job = await this._updateJobUseCase.execute({ jobId, dto });
		return toJobResponse(job);
	}

	@Get(JOB_ROUTERS.DEFAULT)
	@Public()
	@HttpCode(HttpStatus.OK)
	async getJobsForCandidate(
		@Req() req: AuthenticatedRequest,
		@Query("search") search?: string,
		@Query("page") page: string = "1",
		@Query("limit") limit: string = "10",
		@Query("location") location?: string,
		@Query("experience") experience?: string | string[],
		@Query("salary") salary?: string | string[],
		@Query("jobTypes") jobTypes?: string | string[],
	) {
		const parseArray = (val: string | string[] | undefined): string[] | undefined => {
			if (!val) return undefined;
			return Array.isArray(val) ? val : [val];
		};

		const paginationDto: PaginationDto = {
			search,
			page: parseInt(page, 10) || 1,
			limit: parseInt(limit, 10) || 10,
			status: "OPEN",
			is_published: true,
			location,
			experience: parseArray(experience),
			salary: parseArray(salary),
			jobTypes: parseArray(jobTypes),
		};

		const userId = req.user?.role === ROLES.USER ? req.user.id : undefined;

		const paginationResult = await this._getCandidateJobsUseCase.execute({
			paginationDto,
			userId,
		});

		if (!paginationResult) return null;

		return {
			...paginationResult,
			data: paginationResult.data.map((job) => toJobResponseWithScore(job)),
		};
	}

	@Get(JOB_ROUTERS.APPLICATIONS)
	@Roles(ROLES.USER)
	@HttpCode(HttpStatus.OK)
	async getCandidateApplications(
		@Req() req: AuthenticatedRequest,
		@Query("search") search?: string,
		@Query("status") status?: string,
	) {
		const result = await this._getCandidateApplicationsUseCase.execute({
			userId: req.user.id,
			search,
			status,
		});
		return {
			data: result.data.map((r) => ({
				application: {
					id: r.application.id,
					jobId: r.application.jobId,
					status: r.application.status,
					createdAt: r.application.createdAt,
					updatedAt: r.application.updatedAt,
				},
				job: toJobResponse(r.job),
			})),
			stats: result.stats
		};
	}

	@Get(`:${JOB_ROUTERS.ID_PARAM}/stats`)
	@Roles(ROLES.ADMIN, ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async getJobStats(@Param(JOB_ROUTERS.ID_PARAM) jobId: string) {
		return this._getJobStatsUseCase.execute(jobId);
	}

	@Get(`:${JOB_ROUTERS.ID_PARAM}/applications`)
	@Roles(ROLES.ADMIN, ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async getJobApplications(
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
		@Query("page") page: string = "1",
		@Query("limit") limit: string = "10",
		@Query("search") search?: string,
		@Query("status") status?: string,
	) {
		return this._getJobApplicationsUseCase.execute({ 
			jobId, 
			page: Number(page), 
			limit: Number(limit),
			search,
			status
		});
	}

	@Get(`:${JOB_ROUTERS.ID_PARAM}`)
	@Public()
	@HttpCode(HttpStatus.OK)
	async getJobById(
		@Req() req: AuthenticatedRequest,
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
	) {
		const userId = req.user?.role === ROLES.USER ? req.user.id : undefined;

		const job = await this._getJobByIdUseCase.execute({
			jobId,
			userId,
			userRole: req.user?.role,
		});

		return toJobResponseWithScore(job);
	}
}
