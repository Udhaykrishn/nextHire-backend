import {
	Body,
	Controller,
	Delete,
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
import { CreateRecruiterDto, ResponseRecruiterDto, VerifyRecruiterCompanyDto } from "@/application/dto/recruiter";
import { UpdateRecruiterDto } from "@/application/dto/recruiter";

import { StartVerificationSessionDto, VerifyOtpDto } from "@/application/dto/recruiter/verification-session.dto";
import { RevokeCompanyVerificationDto } from "@/application/dto/recruiter/revoke-company-verification.dto";
import { ChangePasswordDto } from "@/application/dto/users";
import { ROLES } from "@/presentation/enums";
import { RecruiterBlockedGuard } from "@/presentation/guards/block";
import type { Request } from "express";
import { IRecruiterController } from "../interface/recruiter.interface";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.RECRUITER)
@Controller(RECRUITER_ROUTERS.ROUTER)
export class RecruiterController implements IRecruiterController {
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
			{ message: string }
		>,
		@Inject(RECRUITER_TOKEN.DELETE_PROFILE_IMAGE_USE_CASE)
		private readonly _deleteProfileImageUseCase: IExecutable<string, { message: string }>,
		@Inject(RECRUITER_TOKEN.RECRUITER_FIND_BY_EMAIL_USE_CASE)
		private readonly _findByEmailUseCase: IExecutable<string, ResponseRecruiterDto>,
		@Inject(RECRUITER_TOKEN.VERIFY_RECRUITER_COMPANY_USE_CASE)
		private readonly _verifyCompanyUseCase: IExecutable<VerifyRecruiterCompanyDto, ResponseRecruiterDto>,
		@Inject(RECRUITER_TOKEN.START_VERIFICATION_SESSION_USE_CASE)
		private readonly _startVerificationSessionUseCase: IExecutable<
			{ recruiterId: string; dto: StartVerificationSessionDto },
			{ message: string; otp?: string }
		>,
		@Inject(RECRUITER_TOKEN.GET_VERIFICATION_SESSION_USE_CASE)
		private readonly _getVerificationSessionUseCase: IExecutable<
			string,
			{ step: string; cin: string; otp: string } | null
		>,
		@Inject(RECRUITER_TOKEN.VERIFY_OTP_SESSION_USE_CASE)
		private readonly _verifyOtpSessionUseCase: IExecutable<{ recruiterId: string; dto: VerifyOtpDto }, void>,
		@Inject(RECRUITER_TOKEN.DELETE_VERIFICATION_SESSION_USE_CASE)
		private readonly _deleteVerificationSessionUseCase: IExecutable<string, { message: string }>,
		@Inject(RECRUITER_TOKEN.REVOKE_COMPANY_VERIFICATION_USE_CASE)
		private readonly _revokeCompanyVerificationUseCase: IExecutable<
			{ recruiterId: string; dto: RevokeCompanyVerificationDto },
			ResponseRecruiterDto
		>,
		@Inject(RECRUITER_TOKEN.GET_SUBSCRIPTION_HISTORY_USE_CASE)
		private readonly _getSubscriptionHistoryUseCase: IExecutable<string, unknown[]>,
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
		@Query("status") status?: string,
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
	@Roles(ROLES.RECRUITER, ROLES.ADMIN)
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
	): Promise<{ message: string }> {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		const recruiter = await this._getOneUseCase.execute(req.user.id);
		return this._uploadProfileImageUseCase.execute({ recruiterId: recruiter.id, file });
	}

	@UseGuards(RecruiterBlockedGuard)
	@Delete(RECRUITER_ROUTERS.UPLOAD_PROFILE_IMAGE)
	@HttpCode(HttpStatus.OK)
	async deleteProfileImage(@Req() req: Request): Promise<{ message: string }> {
		return this._deleteProfileImageUseCase.execute(req.user.id);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Post(RECRUITER_ROUTERS.VERIFY_COMPANY)
	@HttpCode(HttpStatus.OK)
	async verifyCompany(@Body() dto: VerifyRecruiterCompanyDto): Promise<ResponseRecruiterDto> {
		return this._verifyCompanyUseCase.execute(dto);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Post("verification/start")
	@HttpCode(HttpStatus.OK)
	async startVerificationSession(
		@Req() req: Request,
		@Body() dto: StartVerificationSessionDto,
	): Promise<{ message: string; otp?: string }> {
		return this._startVerificationSessionUseCase.execute({ recruiterId: req.user.id, dto });
	}

	@UseGuards(RecruiterBlockedGuard)
	@Get("verification/session")
	@HttpCode(HttpStatus.OK)
	async getVerificationSession(@Req() req: Request): Promise<{ step: string; cin: string; otp: string } | null> {
		return this._getVerificationSessionUseCase.execute(req.user.id);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Delete("verification/session")
	@HttpCode(HttpStatus.OK)
	async deleteVerificationSession(@Req() req: Request): Promise<{ message: string }> {
		return this._deleteVerificationSessionUseCase.execute(req.user.id);
	}

	@UseGuards(RecruiterBlockedGuard)
	@Post("verification/verify")
	@HttpCode(HttpStatus.OK)
	async verifyOtpSession(@Req() req: Request, @Body() dto: VerifyOtpDto): Promise<{ message: string }> {
		await this._verifyOtpSessionUseCase.execute({ recruiterId: req.user.id, dto });
		return { message: "Company verified successfully" };
	}

	@Patch(`:${RECRUITER_ROUTERS.ID_PARAM}/revoke-verification`)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async revokeVerification(
		@Param(RECRUITER_ROUTERS.ID_PARAM) recruiterId: string,
		@Body() dto: RevokeCompanyVerificationDto,
	): Promise<ResponseRecruiterDto> {
		return this._revokeCompanyVerificationUseCase.execute({ recruiterId, dto });
	}

	@UseGuards(RecruiterBlockedGuard)
	@Get("subscription-history")
	@HttpCode(HttpStatus.OK)
	async getSubscriptionHistory(@Req() req: Request) {
		return this._getSubscriptionHistoryUseCase.execute(req.user.id);
	}
}
