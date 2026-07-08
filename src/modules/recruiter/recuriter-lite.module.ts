import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { RecruiterApplicationMapper } from "@/application/mappers/recruiter-application.mapper";
import {
	Recruiter,
	Recruiterschema,
	SubscriptionHistory,
	SubscriptionHistorySchema,
} from "@/infrastructure/db/mongodb/models";
import { RecruiterRepository } from "@/infrastructure/db/mongodb/repository/recruiter.repository";
import { SubscriptionHistoryRepository } from "@/infrastructure/db/mongodb/repository/subscription-history.repository";
import { RecruiterPresitanceMapper } from "@/infrastructure/mappers/recruiter-presistance.mapper";
import { SubscriptionHistoryPersistenceMapper } from "@/infrastructure/mappers/subscription-history-persistence.mapper";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { S3Service } from "@/infrastructure/services/implements";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Recruiter.name, schema: Recruiterschema },
			{ name: SubscriptionHistory.name, schema: SubscriptionHistorySchema },
		]),
	],
	providers: [
		{
			provide: RECRUITER_MAPPER.RECRUITER_APPLICATION,
			useClass: RecruiterApplicationMapper,
		},
		{
			provide: RECRUITER_MAPPER.RECRUITER_PRESISTANCE,
			useClass: RecruiterPresitanceMapper,
		},
		{
			provide: RECRUITER_TOKEN.RECRUITER_REPOSITORY,
			useClass: RecruiterRepository,
		},
		{
			provide: RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_REPOSITORY,
			useClass: SubscriptionHistoryRepository,
		},
		{
			provide: RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_MAPPER,
			useClass: SubscriptionHistoryPersistenceMapper,
		},
		{
			provide: "S3_SERVICE",
			useClass: S3Service,
		},
	],
	exports: [
		MongooseModule,
		RECRUITER_TOKEN.RECRUITER_REPOSITORY,
		RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_REPOSITORY,
		RECRUITER_MAPPER.RECRUITER_PRESISTANCE,
		RECRUITER_MAPPER.RECRUITER_APPLICATION,
		"S3_SERVICE",
	],
})
export class RecruiterLiteModule {}
