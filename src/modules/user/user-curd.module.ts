import { USERS_TOKEN } from "@/application/enums/tokens";
import {
	BlockUnblockUserUseCase,
	CheckUserBlockedUseCase,
	CreateUserUseCase,
	GetAllUsersUseCase,
	UpdateUserUseCase,
	UserChangePasswordUseCase,
	FindUserByEmailUseCase,
	UploadProfileImageUseCase,
} from "@/application/use-case/users";
import { S3Service } from "@/infrastructure/services/implements";
import { CommonModule } from "../common.module";
import { UserLiteModule } from "./user-db.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [UserLiteModule, CommonModule],
	providers: [
		{ provide: USERS_TOKEN.USER_CREATE_USE_CASE, useClass: CreateUserUseCase },
		{ provide: USERS_TOKEN.USER_UPDATE_USE_CASE, useClass: UpdateUserUseCase },
		{
			provide: USERS_TOKEN.USER_GET_ALL_USE_CASE,
			useClass: GetAllUsersUseCase,
		},
		{
			provide: USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE,
			useClass: BlockUnblockUserUseCase,
		},
		{
			provide: USERS_TOKEN.CHANGE_PASSWORD_USE_CASE,
			useClass: UserChangePasswordUseCase,
		},
		{
			provide: USERS_TOKEN.CHECK_USER_BLOCKED_USE_CASE,
			useClass: CheckUserBlockedUseCase,
		},
		{
			provide: USERS_TOKEN.USER_FIND_BY_EMAIL_USE_CASE,
			useClass: FindUserByEmailUseCase,
		},
		{
			provide: USERS_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE,
			useClass: UploadProfileImageUseCase,
		},
		{
			provide: "S3_SERVICE",
			useClass: S3Service,
		},
	],
	exports: [
		USERS_TOKEN.USER_CREATE_USE_CASE,
		USERS_TOKEN.CHECK_USER_BLOCKED_USE_CASE,
		USERS_TOKEN.USER_UPDATE_USE_CASE,
		USERS_TOKEN.USER_GET_ALL_USE_CASE,
		USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE,
		USERS_TOKEN.CHANGE_PASSWORD_USE_CASE,
		USERS_TOKEN.USER_FIND_BY_EMAIL_USE_CASE,
		USERS_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE,
		"S3_SERVICE",
	],
})
export class UserCrudModule { }
