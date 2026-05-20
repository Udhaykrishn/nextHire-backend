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
	DeleteProfileImageUseCase,
	UpdateUserSubscriptionUseCase,
	UploadResumeUseCase,
	DeleteResumeUseCase,
	GetOneUserUseCase,
} from "@/application/use-case/users";
import { CommonModule } from "../common.module";
import { UserLiteModule } from "./user-db.module";
import { Module } from "@nestjs/common";

@Module({
	imports: [UserLiteModule, CommonModule],
	providers: [
		{ provide: USERS_TOKEN.USER_CREATE_USE_CASE, useClass: CreateUserUseCase },
		{ provide: USERS_TOKEN.USER_UPDATE_USE_CASE, useClass: UpdateUserUseCase },
		{
			provide: USERS_TOKEN.USER_GET_USE_CASE,
			useClass: GetOneUserUseCase,
		},
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
			provide: USERS_TOKEN.DELETE_PROFILE_IMAGE_USE_CASE,
			useClass: DeleteProfileImageUseCase,
		},
		{
			provide: USERS_TOKEN.USER_UPDATE_SUBSCRIPTION_USE_CASE,
			useClass: UpdateUserSubscriptionUseCase,
		},
		{
			provide: USERS_TOKEN.UPLOAD_RESUME_USE_CASE,
			useClass: UploadResumeUseCase,
		},
		{
			provide: USERS_TOKEN.DELETE_RESUME_USE_CASE,
			useClass: DeleteResumeUseCase,
		},
	],
	exports: [
		USERS_TOKEN.USER_CREATE_USE_CASE,
		USERS_TOKEN.CHECK_USER_BLOCKED_USE_CASE,
		USERS_TOKEN.USER_UPDATE_USE_CASE,
		USERS_TOKEN.USER_GET_USE_CASE,
		USERS_TOKEN.USER_GET_ALL_USE_CASE,
		USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE,
		USERS_TOKEN.CHANGE_PASSWORD_USE_CASE,
		USERS_TOKEN.USER_FIND_BY_EMAIL_USE_CASE,
		USERS_TOKEN.UPLOAD_PROFILE_IMAGE_USE_CASE,
		USERS_TOKEN.DELETE_PROFILE_IMAGE_USE_CASE,
		USERS_TOKEN.USER_UPDATE_SUBSCRIPTION_USE_CASE,
		USERS_TOKEN.UPLOAD_RESUME_USE_CASE,
		USERS_TOKEN.DELETE_RESUME_USE_CASE,
	],
})
export class UserCrudModule { }
