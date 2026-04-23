import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard, RoleGuard, PermissionGuard } from "@/presentation/guards";
import { Permissions } from "@/presentation/decorators";
import { JOB_ROUTERS } from "@/presentation/enums/job-router.enum";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { PERMISSION } from "@/domain/enums";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";
import { CreateJobDto } from "@/application/dto/job/create-job.dto";
import { JobEntity } from "@/domain/entity/job.entity";
import { JobApplicationEntity } from "@/domain/entity/job-application.entity";
import { ApplyJobDto } from "@/application/use-case/job/apply-job.use-case";
import { IJobController } from "../interface/job.interface";

@UseGuards(AuthGuard, RoleGuard, PermissionGuard)
@Controller(JOB_ROUTERS.ROUTER)
export class JobController implements IJobController {
	constructor(
		@Inject(JOB_TOKEN.CREATE_JOB_USE_CASE)
		private readonly _createJobUseCase: IExecutable<CreateJobDto, JobEntity>,
		@Inject(JOB_TOKEN.APPLY_JOB_USE_CASE)
		private readonly _applyJobUseCase: IExecutable<ApplyJobDto, JobApplicationEntity>,
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
}
