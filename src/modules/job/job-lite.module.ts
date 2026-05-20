import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Jobs, JobsSchema } from "@/infrastructure/db/mongodb/models/job.schema";
import { Application, ApplicationSchema } from "@/infrastructure/db/mongodb/models/application.schema";
import { JobRepository } from "@/infrastructure/db/mongodb/repository/job.repository";
import { JobApplicationRepository } from "@/infrastructure/db/mongodb/repository/job-application.repository";
import { JobPersistenceMapper } from "@/infrastructure/mappers/job-persistence.mapper";
import { JobApplicationPersistenceMapper } from "@/infrastructure/mappers/job-application-persistence.mapper";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { JOB_MAPPER } from "@/application/enums/mappers/job-mapper.enum";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Jobs.name, schema: JobsSchema },
			{ name: Application.name, schema: ApplicationSchema },
		]),
	],
	providers: [
		{
			provide: JOB_TOKEN.JOB_REPOSITORY,
			useClass: JobRepository,
		},
		{
			provide: JOB_MAPPER.JOB_PERSISTENCE,
			useClass: JobPersistenceMapper,
		},
		{
			provide: JOB_TOKEN.JOB_APPLICATION_REPOSITORY,
			useClass: JobApplicationRepository,
		},
		{
			provide: JOB_MAPPER.JOB_APPLICATION_PERSISTENCE,
			useClass: JobApplicationPersistenceMapper,
		},
	],
	exports: [
		MongooseModule,
		JOB_TOKEN.JOB_REPOSITORY,
		JOB_MAPPER.JOB_PERSISTENCE,
		JOB_TOKEN.JOB_APPLICATION_REPOSITORY,
		JOB_MAPPER.JOB_APPLICATION_PERSISTENCE,
	],
})
export class JobLiteModule {}
