import { USERS_TOKEN } from "@/application/enums/tokens";
import {
	BlockUnblockUserUseCase,
	CreateUserUseCase,
	GetAllUsersUseCase,
	UpdateUserUseCase,
	UserChangePasswordUseCase,
} from "@/application/use-case/users";
import { CommonModule } from "./common.module";
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
	],
	exports: [
		USERS_TOKEN.USER_CREATE_USE_CASE,
		USERS_TOKEN.USER_UPDATE_USE_CASE,
		USERS_TOKEN.USER_GET_ALL_USE_CASE,
		USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE,
		USERS_TOKEN.CHANGE_PASSWORD_USE_CASE,
	],
})
export class UserCrudModule {}
