import { ADMIN_MAPPER, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import { AdminSchema } from "@/infrastructure/db/mongodb/models";
import { AdminRepository } from "@/infrastructure/db/mongodb/repository";
import { AdminPresitanceMapper, AdminApplicationMapper } from "@/infrastructure/mappers";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
	imports: [MongooseModule.forFeature([{ name: "Admin", schema: AdminSchema }])],
	providers: [
		{
			provide: ADMIN_MAPPER.ADMIN_PRESISTANCE,
			useClass: AdminPresitanceMapper,
		},
		{
			provide: ADMIN_MAPPER.ADMIN_APPLICATION,
			useClass: AdminApplicationMapper,
		},
		{
			provide: ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY,
			useClass: AdminRepository,
		},
	],
	exports: [
		MongooseModule,
		ADMIN_MAPPER.ADMIN_PRESISTANCE,
		ADMIN_MAPPER.ADMIN_APPLICATION,
		ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY,
	],
})
export class AdminLiteModule {}
