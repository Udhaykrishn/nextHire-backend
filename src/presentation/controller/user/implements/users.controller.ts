import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
	UploadedFile,
	UseInterceptors,
	Delete,
	BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { ROLES, USER_ROUTERS } from "@/presentation/enums";
import { USERS_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { CreateUserDto } from "@/application/dto/users/user-create.dto";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import type { PaginationDto } from "@/application/dto/pagiation";
import { type PaginationResponse, PaginationInputType } from "@/domain/types/paginations";
import type { ChangePasswordDto, UpdateUserDto, UserSubscriptionUpdateDto } from "@/application/dto/users";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { UserBlockedGuard } from "@/presentation/guards/block";
import { IUserController } from "../interface/user.interface";

@UseGuards(AuthGuard, RoleGuard)
@Roles(ROLES.USER)
@Controller(USER_ROUTERS.ROUTER)
export class UserController implements IUserController {
	constructor(
		@Inject(USERS_TOKEN.USER_CREATE_USE_CASE)
		private readonly _userCreateUseCase: IExecutable<CreateUserDto, ResponseUserDto>,
		@Inject(USERS_TOKEN.USER_GET_ALL_USE_CASE)
		private readonly _getAllUsersUseCase: IExecutable<PaginationDto, PaginationResponse<ResponseUserDto>>,
		@Inject(USERS_TOKEN.USER_UPDATE_USE_CASE)
		private readonly _updateUserUseCase: IExecutable<{ userId: string; data: UpdateUserDto }, ResponseUserDto>,
		@Inject(USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE)
		private readonly _blockUnblockUseCase: IExecutable<string, ResponseUserDto>,
		@Inject(USERS_TOKEN.CHANGE_PASSWORD_USE_CASE)
		private readonly _changePasswordUseCase: IExecutable<
			{ userId: string; dto: ChangePasswordDto },
			ResponseUserDto
		>,
		@Inject(USERS_TOKEN.USER_FIND_BY_EMAIL_USE_CASE)
		private readonly _findUserByEmailUseCase: IExecutable<string, ResponseUserDto>,
		@Inject(USERS_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE)
		private readonly _uploadProfileImageUseCase: IExecutable<{ userId: string; file: any }, ResponseUserDto>,
		@Inject(USERS_TOKEN.DELETE_PROFILE_IMAGE_USE_CASE)
		private readonly _deleteProfileImageUseCase: IExecutable<string, ResponseUserDto>,
		@Inject(USERS_TOKEN.USER_UPDATE_SUBSCRIPTION_USE_CASE)
		private readonly _updateUserSubscriptionUseCase: IExecutable<
			{ userId: string; dto: UserSubscriptionUpdateDto },
			ResponseUserDto
		>,
	) {}

	@Post(USER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() userDto: CreateUserDto): Promise<ResponseUserDto> {
		return this._userCreateUseCase.execute(userDto);
	}

	@Patch(USER_ROUTERS.BLOCK)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async blockAndUnblock(@Param(USER_ROUTERS.ID_PARAM) userId: string): Promise<ResponseUserDto> {
		return this._blockUnblockUseCase.execute(userId);
	}

	@UseGuards(UserBlockedGuard)
	@Patch(USER_ROUTERS.UPDATE)
	@HttpCode(HttpStatus.OK)
	async updateProfile(@Req() req: any, @Body() updateDto: UpdateUserDto): Promise<ResponseUserDto> {
		return this._updateUserUseCase.execute({ data: updateDto, userId: req.user.id });
	}

	@UseGuards(UserBlockedGuard)
	@Patch(`:${USER_ROUTERS.ID_PARAM} `)
	@HttpCode(HttpStatus.OK)
	async update(
		@Param(USER_ROUTERS.ID_PARAM) userId: string,
		@Body() updateDto: UpdateUserDto,
	): Promise<ResponseUserDto> {
		return this._updateUserUseCase.execute({ data: updateDto, userId });
	}

	@UseGuards(UserBlockedGuard)
	@Patch(USER_ROUTERS.CHNAGE_PASWORD)
	@HttpCode(HttpStatus.OK)
	async changePassword(
		@Param(USER_ROUTERS.ID_PARAM) userId: string,
		@Body() changePasswordDto: ChangePasswordDto,
	): Promise<ResponseUserDto> {
		return this._changePasswordUseCase.execute({
			dto: changePasswordDto,
			userId,
		});
	}

	@Get(USER_ROUTERS.DEFAULT)
	@Roles(ROLES.ADMIN)
	@HttpCode(HttpStatus.OK)
	async getAllUsers(
		@Query(PaginationInputType.SEARCH) search?: string,
		@Query(PaginationInputType.PAGE, ParseIntPipe) page: number = 1,
		@Query(PaginationInputType.LIMIT, ParseIntPipe) limit: number = 10,
	): Promise<PaginationResponse<ResponseUserDto>> {
		const paginationDto: PaginationDto = {
			search,
			page,
			limit,
		};
		return this._getAllUsersUseCase.execute(paginationDto);
	}

	@UseGuards(UserBlockedGuard)
	@Get(USER_ROUTERS.PROFILE)
	@HttpCode(HttpStatus.OK)
	async findUser(@Req() req: any): Promise<ResponseUserDto> {
		return this._findUserByEmailUseCase.execute(req.user.email);
	}

	@Post(USER_ROUTERS.UPLOAD_PROFILE_IMAGE)
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(
		FileInterceptor("image", {
			storage: memoryStorage(),
			limits: {
				fileSize: 5 * 1024 * 1024,
			},
			fileFilter: (req: any, file: any, callback: any) => {
				if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
					return callback(new BadRequestException("Only image files are allowed!"), false);
				}
				callback(null, true);
			},
		}),
	)
	@UseGuards(AuthGuard)
	async uploadProfileImage(@UploadedFile() file: any, @Req() req: any): Promise<ResponseUserDto> {
		if (!file) {
			throw new BadRequestException("No file uploaded");
		}
		return this._uploadProfileImageUseCase.execute({ userId: req.user.id, file });
	}

	@Delete(USER_ROUTERS.UPLOAD_PROFILE_IMAGE)
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async deleteProfileImage(@Req() req: any): Promise<ResponseUserDto> {
		return this._deleteProfileImageUseCase.execute(req.user.id);
	}
	@Patch("subscription/upgrade")
	@UseGuards(AuthGuard)
	@HttpCode(HttpStatus.OK)
	async updateSubscription(@Req() req: any, @Body() dto: UserSubscriptionUpdateDto): Promise<ResponseUserDto> {
		return this._updateUserSubscriptionUseCase.execute({ userId: req.user.id, dto });
	}
}
