import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
	ParseIntPipe,
} from "@nestjs/common";
import type { IExecutable } from "@/application/interface/executable.interface";

import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";
import { PaginationInputType } from "@/domain/types/paginations";

import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { RECRUITER_ROUTERS } from "@/presentation/enums/recuriter";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import {
	CreateRecruiterDto,
	ResponseRecruiterDto,
} from "@/application/dto/recruiter";
import { UpdateRecruiterDto } from "@/application/dto/recruiter";
import { ChangePasswordDto } from "@/application/dto/users";
import { ROLES } from "@/presentation/enums";
import { RecruiterBlockedGuard } from "@/presentation/guards/block";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(RECRUITER_ROUTERS.ROUTER)
export class RecruiterController {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_CREATE_USE_CASE)
		private readonly _createUseCase: IExecutable<
			CreateRecruiterDto,
			ResponseRecruiterDto
		>,

		@Inject(RECRUITER_TOKEN.RECRUITER_GET_ALL_USE_CASE)
		private readonly _getAllUseCase: IExecutable<
			PaginationDto,
			PaginationResponse<ResponseRecruiterDto>
		>,

		@Inject(RECRUITER_TOKEN.RECRUITER_GET_ONE_USE_CASE)
		private readonly _getOneUseCase: IExecutable<string, ResponseRecruiterDto>,

		@Inject(RECRUITER_TOKEN.RECRUITER_UPDATE_USE_CASE)
		private readonly _updateUseCase: IExecutable<
			{ recruiterId: string; data: UpdateRecruiterDto },
			ResponseRecruiterDto
		>,

		@Inject(RECRUITER_TOKEN.RECRUITER_BLOCK_UNBLOCK_USE_CASE)
		private readonly _blockUnblockUseCase: IExecutable<
			string,
			ResponseRecruiterDto
		>,

		@Inject(RECRUITER_TOKEN.RECRUITER_CHANGE_PASSWORD_USE_CASE)
		private readonly _changePasswordUseCase: IExecutable<
			{ recruiterId: string; dto: ChangePasswordDto },
			ResponseRecruiterDto
		>,
	) {}

	@Post(RECRUITER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() dto: CreateRecruiterDto): Promise<ResponseRecruiterDto> {
		return this._createUseCase.execute(dto);
	}

	@Get(RECRUITER_ROUTERS.DEFAULT)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getAll(
		@Query(PaginationInputType.SEARCH) search?: string,
		@Query(PaginationInputType.PAGE, ParseIntPipe) page: number = 1,
		@Query(PaginationInputType.LIMIT, ParseIntPipe) limit: number = 10,
	): Promise<PaginationResponse<ResponseRecruiterDto>> {
		const paginationDto: PaginationDto = { search, page, limit };
		return this._getAllUseCase.execute(paginationDto);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Get(`:${RECRUITER_ROUTERS.ID_PARAM}`)
	@HttpCode(HttpStatus.OK)
	async getOne(
		@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string,
	): Promise<ResponseRecruiterDto> {
		return this._getOneUseCase.execute(recruiterId);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Patch(`:${RECRUITER_ROUTERS.ID_PARAM}`)
	@HttpCode(HttpStatus.OK)
	async update(
		@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string,
		@Body() dto: UpdateRecruiterDto,
	): Promise<ResponseRecruiterDto> {
		return this._updateUseCase.execute({ recruiterId, data: dto });
	}

	@Patch(RECRUITER_ROUTERS.BLOCK)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async blockUnblock(
		@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string,
	): Promise<ResponseRecruiterDto> {
		return this._blockUnblockUseCase.execute(recruiterId);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Patch(RECRUITER_ROUTERS.CHANGE_PASSWORD)
	@HttpCode(HttpStatus.OK)
	async changePassword(
		@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string,
		@Body() dto: ChangePasswordDto,
	): Promise<ResponseRecruiterDto> {
		return this._changePasswordUseCase.execute({ recruiterId, dto });
	}
}
