import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "@/infrastructure/db/mongodb/models";
import { UserController } from "@/presentation/controller/users.controller";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { CreateUserUseCase } from "@/application/use-case/users/user-create.use-case";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import { UserApplicationMapper } from "@/application/mappers/users-application.mapper";
import { UserPresitanceMapper } from "@/infrastructure/mappers/user-presistance.mapper";
import { UserRepository } from "@/infrastructure/db/mongodb/repository";

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
	],
	exports: [],
})
export class UserModule {}
