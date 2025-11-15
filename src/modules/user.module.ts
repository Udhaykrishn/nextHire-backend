import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@/infrastructure/db/mongodb/models";
import { UserController } from "@/presentation/controller/users.controller";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import { CreateUserUseCase } from "@/application/use-case/users/user-create.use-case";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import { UserApplicationMapper } from "@/application/mappers/users-application.mapper";
import { UserPresitanceMapper } from "@/infrastructure/mappers/user-presistance.mapper";
import { UserRepository } from "@/infrastructure/db/mongodb/repository";
import { UpdateUserUseCase } from "@/application/use-case/users/user-update.use-case";
import {
	BlockUnblockUserUseCase,
	GetAllUsersUseCase,
} from "@/application/use-case/users";
import { EmailService } from "@/infrastructure/services/implements/email-service";
import { PasswordHash } from "@/infrastructure/services/implements/password-service";

console.log("User name is: ", User.name);

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
	],
	controllers: [UserController],
	providers: [
		{
			provide: USERS_TOKEN.USER_CREATE_USE_CASE,
			useClass: CreateUserUseCase,
		},
		{
			provide: USERS_TOKEN.USER_UPDATE_USE_CASE,
			useClass: UpdateUserUseCase,
		},
		{
			provide: USERS_TOKEN.USER_GET_ALL_USE_CASE,
			useClass: GetAllUsersUseCase,
		},
		{
			provide: USER_MAPPER.USER_APPLICATION,
			useClass: UserApplicationMapper,
		},
		{
			provide: USER_MAPPER.USER_PRESISTANCE,
			useClass: UserPresitanceMapper,
		},
		{
			provide: USERS_TOKEN.USER_REPOSITORY,
			useClass: UserRepository,
		},
		{
			provide: USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE,
			useClass: BlockUnblockUserUseCase,
		},
		{
			provide: COMMON_TOKEN.EMAIL_SERVICE,
			useClass: EmailService,
		},
		{
			provide: COMMON_TOKEN.PASSWORD_HASH,
			useClass: PasswordHash,
		},
	],
	exports: [],
})
export class UserModule {}
