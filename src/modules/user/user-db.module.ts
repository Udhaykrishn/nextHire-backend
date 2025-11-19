import { USER_MAPPER, USERS_TOKEN } from "@/application/enums/tokens";
import { UserApplicationMapper } from "@/application/mappers/users-application.mapper";
import { UserSchema } from "@/infrastructure/db/mongodb/models";
import { UserRepository } from "@/infrastructure/db/mongodb/repository";
import { UserPresitanceMapper } from "@/infrastructure/mappers";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [MongooseModule.forFeature([{ name: "User", schema: UserSchema }])],
	providers: [
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
	exports: [
		MongooseModule,
		USER_MAPPER.USER_PRESISTANCE,
		USER_MAPPER.USER_APPLICATION,
		USERS_TOKEN.USER_REPOSITORY,
	],
})
export class UserLiteModule {}
