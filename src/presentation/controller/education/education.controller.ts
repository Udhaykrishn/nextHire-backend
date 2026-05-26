import { CreateEducationDto } from "@/application/dto/education/create-education.dto";
import { UpdateEducationDto } from "@/application/dto/education/update-education.dto";
import { ResponseEducationDto } from "@/application/dto/education/response-education.dto";
import { EDUCATION_TOKEN } from "@/application/enums/tokens/education-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { RoleGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/role.decorator";
import { USER_ROLE } from "@/domain/enums";
import { EDUCATION_ROUTER } from "@/presentation/enums";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards, Query } from "@nestjs/common";
import type { AuthenticatedRequest } from "@/presentation/interface/request.interface";

@Controller(EDUCATION_ROUTER.ROUTER)
@UseGuards(AuthGuard, RoleGuard)
@Roles(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.RECRUITER)
export class EducationController {
	constructor(
		@Inject(EDUCATION_TOKEN.CREATE_EDUCATION_USE_CASE)
		private readonly _createEducationUseCase: IExecutable<CreateEducationDto, ResponseEducationDto>,
		@Inject(EDUCATION_TOKEN.GET_EDUCATIONS_USE_CASE)
		private readonly _getEducationsUseCase: IExecutable<string, ResponseEducationDto[]>,
		@Inject(EDUCATION_TOKEN.UPDATE_EDUCATION_USE_CASE)
		private readonly _updateEducationUseCase: IExecutable<UpdateEducationDto, ResponseEducationDto>,
		@Inject(EDUCATION_TOKEN.DELETE_EDUCATION_USE_CASE)
		private readonly _deleteEducationUseCase: IExecutable<string, void>,
	) {}

	@Post(EDUCATION_ROUTER.DEFAULT)
	async create(@Req() req: AuthenticatedRequest, @Body() dto: CreateEducationDto) {
		dto.userId = req.user.id;
		return await this._createEducationUseCase.execute(dto);
	}

	@Get(EDUCATION_ROUTER.DEFAULT)
	async getAll(@Req() req: AuthenticatedRequest, @Query("userId") userId?: string) {
		const targetUserId = (req.user.role === USER_ROLE.ADMIN || req.user.role === USER_ROLE.RECRUITER) && userId ? userId : req.user.id;
		return await this._getEducationsUseCase.execute(targetUserId);
	}

	@Put(EDUCATION_ROUTER.ID)
	async update(@Param(EDUCATION_ROUTER.ID_PARAM) id: string, @Body() dto: UpdateEducationDto) {
		dto.id = id;
		return await this._updateEducationUseCase.execute(dto);
	}

	@Delete(EDUCATION_ROUTER.ID)
	async delete(@Param(EDUCATION_ROUTER.ID_PARAM) id: string) {
		return await this._deleteEducationUseCase.execute(id);
	}
}
