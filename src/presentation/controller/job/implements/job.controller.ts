import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Post, Req, UseGuards, Query, ParseIntPipe, Patch } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard, RoleGuard, PermissionGuard } from "@/presentation/guards";
import { Permissions, Roles } from "@/presentation/decorators";
import { JOB_ROUTERS } from "@/presentation/enums/job-router.enum";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
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
	async getJobsByRecruiterId(
		@Param(JOB_ROUTERS.ID_PARAM) recruiterId: string,
	): Promise<JobEntity[]> {
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
}
