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
	Req,
	UseGuards,
	ParseIntPipe,
	UploadedFile,
	UseInterceptors,
	BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import type { IExecutable } from "@/application/interface/executable.interface";

import type { PaginationDto } from "@/application/dto/pagiation";
import type { PaginationResponse } from "@/domain/types/paginations";
import { PaginationInputType } from "@/domain/types/paginations";

import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { RECRUITER_ROUTERS } from "@/presentation/enums/recuriter";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { CreateRecruiterDto, ResponseRecruiterDto } from "@/application/dto/recruiter";
import { UpdateRecruiterDto } from "@/application/dto/recruiter";
import { ChangePasswordDto } from "@/application/dto/users";
import { ROLES } from "@/presentation/enums";
import { RecruiterBlockedGuard } from "@/presentation/guards/block";
import type { Request } from "express";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(RECRUITER_ROUTERS.ROUTER)
export class RecruiterController {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_CREATE_USE_CASE)
		private readonly _createUseCase: IExecutable<CreateRecruiterDto, ResponseRecruiterDto>,

		@Inject(RECRUITER_TOKEN.RECRUITER_GET_ALL_USE_CASE)
		private readonly _getAllUseCase: IExecutable<PaginationDto, PaginationResponse<ResponseRecruiterDto>>,

		@Inject(RECRUITER_TOKEN.RECRUITER_GET_ONE_USE_CASE)
		private readonly _getOneUseCase: IExecutable<string, ResponseRecruiterDto>,

		@Inject(RECRUITER_TOKEN.RECRUITER_UPDATE_USE_CASE)
		private readonly _updateUseCase: IExecutable<
			{ recruiterId: string; data: UpdateRecruiterDto },
			ResponseRecruiterDto
		>,

		@Inject(RECRUITER_TOKEN.RECRUITER_BLOCK_UNBLOCK_USE_CASE)
		private readonly _blockUnblockUseCase: IExecutable<string, ResponseRecruiterDto>,

		@Inject(RECRUITER_TOKEN.RECRUITER_CHANGE_PASSWORD_USE_CASE)
		private readonly _changePasswordUseCase: IExecutable<
			{ recruiterId: string; dto: ChangePasswordDto },
			ResponseRecruiterDto
		>,
		@Inject(RECRUITER_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE)
		private readonly _uploadProfileImageUseCase: IExecutable<
			{ recruiterId: string; file: Express.Multer.File },
			ResponseRecruiterDto
		>,
		@Inject(RECRUITER_TOKEN.RECRUITER_FIND_BY_EMAIL_USE_CASE)
		private readonly _findByEmailUseCase: IExecutable<string, ResponseRecruiterDto>,
	) { }

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
		@Query('status') status?: string,
	): Promise<PaginationResponse<ResponseRecruiterDto>> {
		const paginationDto: PaginationDto & { status?: string } = { search, page, limit, status };
		return this._getAllUseCase.execute(paginationDto);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Get(RECRUITER_ROUTERS.PROFILE)
	@HttpCode(HttpStatus.OK)
	async getProfile(@Req() req: Request): Promise<ResponseRecruiterDto> {
		return this._findByEmailUseCase.execute(req.user.email);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Get(`:${RECRUITER_ROUTERS.ID_PARAM}`)
	@HttpCode(HttpStatus.OK)
	async getOne(@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string): Promise<ResponseRecruiterDto> {
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
	async blockUnblock(@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string): Promise<ResponseRecruiterDto> {
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

	@UseGuards(RecruiterBlockedGuard)
	@Post(RECRUITER_ROUTERS.UPLOAD_PROFILE_IMAGE)
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(
		FileInterceptor("image", {
			storage: memoryStorage(),
			limits: {
				fileSize: 5 * 1024 * 1024,
			},
			fileFilter: (_req, file, cb) => {
				if (!file.mimetype.startsWith("image/")) {
					cb(new BadRequestException("Only image files are allowed"), false);
					return;
				}
				cb(null, true);
			},
		}),
	)
	async uploadProfileImage(
		@Req() req: Request,
		@UploadedFile() file: Express.Multer.File,
	): Promise<ResponseRecruiterDto> {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		const recruiter = await this._getOneUseCase.execute(req.user.id);
		return this._uploadProfileImageUseCase.execute({ recruiterId: recruiter.id, file });
	}
}
