import { CreateProjectDto } from "@/application/dto/project/create-project.dto";
import { UpdateProjectDto } from "@/application/dto/project/update-project.dto";
import { ResponseProjectDto } from "@/application/dto/project/response-project.dto";
import { PROJECT_TOKEN } from "@/application/enums/tokens/project-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { RoleGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/role.decorator";
import { USER_ROLE } from "@/domain/enums";
import { PROJECT_ROUTER } from "@/presentation/enums";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards, Query } from "@nestjs/common";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";

@Controller(PROJECT_ROUTER.ROUTER)
@UseGuards(AuthGuard, RoleGuard)
@Roles(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.RECRUITER)
export class ProjectController {
	constructor(
		@Inject(PROJECT_TOKEN.CREATE_PROJECT_USE_CASE)
		private readonly _createProjectUseCase: IExecutable<CreateProjectDto, ResponseProjectDto>,
		@Inject(PROJECT_TOKEN.GET_PROJECTS_USE_CASE)
		private readonly _getProjectsUseCase: IExecutable<string, ResponseProjectDto[]>,
		@Inject(PROJECT_TOKEN.GET_PROJECT_BY_ID_USE_CASE)
		private readonly _getProjectByIdUseCase: IExecutable<string, ResponseProjectDto>,
		@Inject(PROJECT_TOKEN.UPDATE_PROJECT_USE_CASE)
		private readonly _updateProjectUseCase: IExecutable<UpdateProjectDto, ResponseProjectDto>,
		@Inject(PROJECT_TOKEN.DELETE_PROJECT_USE_CASE)
		private readonly _deleteProjectUseCase: IExecutable<string, void>,
	) {}

	@Post(PROJECT_ROUTER.DEFAULT)
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateProjectDto) {
		dto.userId = req.user.id;
		return await this._createProjectUseCase.execute(dto);
	}

	@Get(PROJECT_ROUTER.DEFAULT)
	async getAll(@Req() req: AuthenticatedRequest, @Query("userId") userId?: string) {
		const targetUserId = (req.user.role === USER_ROLE.ADMIN || req.user.role === USER_ROLE.RECRUITER) && userId ? userId : req.user.id;
		return await this._getProjectsUseCase.execute(targetUserId);
	}

	@Get(PROJECT_ROUTER.ID)
	async getById(@Param(PROJECT_ROUTER.ID_PARAM) id: string) {
		return await this._getProjectByIdUseCase.execute(id);
	}

	@Put(PROJECT_ROUTER.ID)
	async update(@Param(PROJECT_ROUTER.ID_PARAM) id: string, @Body() dto: UpdateProjectDto) {
		dto.id = id;
		return await this._updateProjectUseCase.execute(dto);
	}

	@Delete(PROJECT_ROUTER.ID)
	async delete(@Param(PROJECT_ROUTER.ID_PARAM) id: string) {
		return await this._deleteProjectUseCase.execute(id);
	}
}
