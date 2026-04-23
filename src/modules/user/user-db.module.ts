import { USERS_TOKEN } from "@/application/enums/tokens";
import { UserApplicationMapper } from "@/application/mappers/users-application.mapper";
import { UserSchema } from "@/infrastructure/db/mongodb/models";
import { UserRepository } from "@/infrastructure/db/mongodb/repository";
import { UserPresitanceMapper } from "@/infrastructure/mappers";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { S3Service } from "@/infrastructure/services/implements";
import { USER_MAPPER } from "@/application/enums";

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
		{
			provide: "S3_SERVICE",
			useClass: S3Service,
		},
	],
	exports: [
		MongooseModule,
		USER_MAPPER.USER_PRESISTANCE,
		USER_MAPPER.USER_APPLICATION,
		USERS_TOKEN.USER_REPOSITORY,
		"S3_SERVICE",
	],
})
export class UserLiteModule {}
