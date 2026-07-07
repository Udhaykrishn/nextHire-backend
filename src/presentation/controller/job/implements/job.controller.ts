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
import { UserBlockedGuard, RecruiterBlockedGuard } from "@/presentation/guards/block";
import { JOB_ROUTERS } from "@/presentation/enums/job-router.enum";
import { JOB_TOKEN } from "@/application/enums/tokens";
import { ROLES } from "@/presentation/enums";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { UpdateJobDto } from "@/application/dto/job/update-job.dto";
import { JOB_STATUS } from "@/domain/enums/status";
import { ApplyJobDto } from "@/application/use-case/job/apply-job.use-case";
import { ResponseJobDto } from "@/application/dto/job/response-job.dto";
import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";
import { IJobController } from "../interface/job.interface";
import type { GetCandidateJobsDto } from "@/application/use-case/job/get-candidate-jobs.use-case";
import type { GetJobByIdDto } from "@/application/use-case/job/get-job-by-id.use-case";
import type {
	GetCandidateApplicationsDto,
	GetCandidateApplicationsResponse,
} from "@/application/use-case/job/get-candidate-applications.use-case";
import type { JobStatsResponse } from "@/application/use-case/job/get-job-stats.use-case";
import { UpdateApplicationStatusDto } from "@/application/dto/job/update-application-status.dto";
import { BulkUpdateApplicationStatusDto } from "@/application/dto/job/bulk-update-application-status.dto";
import type {
	GetJobApplicationsDto,
	JobApplicationResponse,
} from "@/application/use-case/job/get-job-applications.use-case";
import type { CalculateMatchScoreDto } from "@/application/use-case/job/calculate-match-score.use-case";
import { toJobResponse, toJobResponseWithScore } from "@/presentation/mappers/job-response.mapper";
import type { JobEntity } from "@/domain/entity/job.entity";

@UseGuards(AuthGuard, RoleGuard, PermissionGuard, UserBlockedGuard, RecruiterBlockedGuard)
@Controller(JOB_ROUTERS.ROUTER)
export class JobController implements IJobController {
	constructor(
		@Inject(JOB_TOKEN.CREATE_JOB_USE_CASE)
		private readonly _createJobUseCase: IExecutable<CreateJobDto, ResponseJobDto>,
		@Inject(JOB_TOKEN.APPLY_JOB_USE_CASE)
		private readonly _applyJobUseCase: IExecutable<ApplyJobDto, JobApplicationResponse>,
		@Inject(JOB_TOKEN.GET_RECRUITER_JOBS_USE_CASE)
		private readonly _getRecruiterJobsUseCase: IExecutable<string, ResponseJobDto[]>,
		@Inject(JOB_TOKEN.GET_ALL_JOBS_USE_CASE)
		private readonly _getAllJobsUseCase: IExecutable<PaginationDto, PaginationResponse<ResponseJobDto> | null>,
		@Inject(JOB_TOKEN.GET_CANDIDATE_JOBS_USE_CASE)
		private readonly _getCandidateJobsUseCase: IExecutable<
			GetCandidateJobsDto,
			PaginationResponse<ResponseJobDto & { matchScore?: number }> | null
		>,
		@Inject(JOB_TOKEN.GET_JOB_BY_ID_USE_CASE)
		private readonly _getJobByIdUseCase: IExecutable<GetJobByIdDto, ResponseJobDto & { matchScore?: number }>,
		@Inject(JOB_TOKEN.GET_CANDIDATE_APPLICATIONS_USE_CASE)
		private readonly _getCandidateApplicationsUseCase: IExecutable<
			GetCandidateApplicationsDto,
			GetCandidateApplicationsResponse
		>,
		@Inject(JOB_TOKEN.GET_JOB_STATS_USE_CASE)
		private readonly _getJobStatsUseCase: IExecutable<string, JobStatsResponse>,
		@Inject(JOB_TOKEN.GET_JOB_APPLICATIONS_USE_CASE)
		private readonly _getJobApplicationsUseCase: IExecutable<
			GetJobApplicationsDto,
			PaginationResponse<JobApplicationResponse>
		>,
		@Inject(JOB_TOKEN.UPDATE_APPLICATION_STATUS_USE_CASE)
		private readonly _updateApplicationStatusUseCase: IExecutable<
			{ dto: UpdateApplicationStatusDto; recruiterId: string },
			void
		>,
		@Inject(JOB_TOKEN.BULK_UPDATE_APPLICATION_STATUS_USE_CASE)
		private readonly _bulkUpdateApplicationStatusUseCase: IExecutable<
			{ dto: BulkUpdateApplicationStatusDto; recruiterId: string },
			void
		>,
		@Inject(JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE)
		private readonly _blockUnblockJobUseCase: IExecutable<string, ResponseJobDto>,
		@Inject(JOB_TOKEN.UPDATE_JOB_USE_CASE)
		private readonly _updateJobUseCase: IExecutable<{ jobId: string; dto: UpdateJobDto }, ResponseJobDto>,
		@Inject(JOB_TOKEN.CALCULATE_MATCH_SCORE_USE_CASE)
		private readonly _calculateMatchScoreUseCase: IExecutable<
			CalculateMatchScoreDto,
			{ matchScore: number; breakdown: Record<string, unknown> }
		>,
	) {}

	@Post(JOB_ROUTERS.DEFAULT)
	@Roles(ROLES.RECRUITER)
	@HttpCode(HttpStatus.CREATED)
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateJobDto) {
		dto.company_id = req.user.id;
		dto.posted_by = req.user.id;
		const job = await this._createJobUseCase.execute(dto);
		return toJobResponse(job as unknown as JobEntity);
	}

	@Post(`${JOB_ROUTERS.APPLY}/:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.USER)
	@HttpCode(HttpStatus.CREATED)
	async apply(
		@Req() req: AuthenticatedRequest,
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
	): Promise<JobApplicationResponse> {
		return this._applyJobUseCase.execute({ userId: req.user.id, jobId });
	}

	@Get(JOB_ROUTERS.RECRUITER)
	@Roles(ROLES.RECRUITER)
	async getRecruiterJobs(@Req() req: AuthenticatedRequest) {
		const jobs = await this._getRecruiterJobsUseCase.execute(req.user.id);
		return (jobs as unknown as (JobEntity & { stats?: Record<string, unknown> })[]).map(toJobResponseWithScore);
	}

	@Get(`${JOB_ROUTERS.RECRUITER}/:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getJobsByRecruiterId(@Param(JOB_ROUTERS.ID_PARAM) recruiterId: string) {
		const jobs = await this._getRecruiterJobsUseCase.execute(recruiterId);
		return (jobs as unknown as (JobEntity & { stats?: Record<string, unknown> })[]).map(toJobResponseWithScore);
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
			data: (result.data as unknown as JobEntity[]).map(toJobResponse),
		};
	}

	@Patch(JOB_ROUTERS.BLOCK)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async blockUnblockJob(@Param(JOB_ROUTERS.ID_PARAM) jobId: string) {
		const job = await this._blockUnblockJobUseCase.execute(jobId);
		return toJobResponse(job as unknown as JobEntity);
	}

	@Get(`:${JOB_ROUTERS.ID_PARAM}/candidates/:candidateId/match-score`)
	@Roles(ROLES.ADMIN, ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async getCandidateMatchScore(
		@Param(JOB_ROUTERS.ID_PARAM) jobId: string,
		@Param("candidateId") candidateId: string,
		@Query("retry") retry?: string,
	) {
		return this._calculateMatchScoreUseCase.execute({ jobId, candidateId, retry: retry === "true" });
	}

	@Patch(`:${JOB_ROUTERS.ID_PARAM}`)
	@Roles(ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async updateJob(@Param(JOB_ROUTERS.ID_PARAM) jobId: string, @Body() dto: UpdateJobDto) {
		const job = await this._updateJobUseCase.execute({ jobId, dto });
		return toJobResponse(job as unknown as JobEntity);
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
			status: JOB_STATUS.OPEN,
			is_published: true,
			location,
			experience: parseArray(experience),
			salary: parseArray(salary),
			jobTypes: parseArray(jobTypes),
			locationTypes: parseArray(req.query.locationTypes as string | string[]),
			jobCategories: parseArray(req.query.jobCategories as string | string[]),
			nightShift: req.query.nightShift === "true",
			datePosted: typeof req.query.datePosted === "string" ? req.query.datePosted : undefined,
			sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
			minSalary: typeof req.query.minSalary === "string" ? parseInt(req.query.minSalary, 10) : undefined,
			maxSalary: typeof req.query.maxSalary === "string" ? parseInt(req.query.maxSalary, 10) : undefined,
		};

		const userId = req.user?.role === ROLES.USER ? req.user.id : undefined;

		const paginationResult = await this._getCandidateJobsUseCase.execute({
			paginationDto,
			userId,
		});

		if (!paginationResult) return null;

		return {
			...paginationResult,
			data: (paginationResult.data as unknown as (JobEntity & { matchScore?: number })[]).map(
				toJobResponseWithScore,
			),
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
				job: toJobResponse(r.job as unknown as JobEntity),
			})),
			stats: result.stats,
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
			status,
		});
	}

	@Patch(`application/bulk/status`)
	@Roles(ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async bulkUpdateApplicationStatus(@Req() req: AuthenticatedRequest, @Body() dto: BulkUpdateApplicationStatusDto) {
		return this._bulkUpdateApplicationStatusUseCase.execute({
			dto,
			recruiterId: req.user.id,
		});
	}

	@Patch(`application/:applicationId/status`)
	@Roles(ROLES.RECRUITER)
	@HttpCode(HttpStatus.OK)
	async updateApplicationStatus(
		@Req() req: AuthenticatedRequest,
		@Param("applicationId") applicationId: string,
		@Body() dto: UpdateApplicationStatusDto,
	) {
		return this._updateApplicationStatusUseCase.execute({
			dto: {
				applicationId,
				status: dto.status,
			},
			recruiterId: req.user.id,
		});
	}

	@Get(`:${JOB_ROUTERS.ID_PARAM}`)
	@Public()
	@HttpCode(HttpStatus.OK)
	async getJobById(@Req() req: AuthenticatedRequest, @Param(JOB_ROUTERS.ID_PARAM) jobId: string) {
		const userId = req.user?.role === ROLES.USER ? req.user.id : undefined;

		const job = await this._getJobByIdUseCase.execute({
			jobId,
			userId,
			userRole: req.user?.role,
		});

		return toJobResponseWithScore(job as unknown as JobEntity & { matchScore?: number });
	}
}
