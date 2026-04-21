import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Jobs, JobsSchema } from "@/infrastructure/db/mongodb/models/job.schema";
import { JobRepository } from "@/infrastructure/db/mongodb/repository/job.repository";
import { JobPersistenceMapper } from "@/infrastructure/mappers/job-persistence.mapper";
import { CreateJobUseCase } from "@/application/use-case/job/create-job.use-case";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { JOB_MAPPER } from "@/application/enums/mappers/job-mapper.enum";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Jobs.name, schema: JobsSchema }]),
		RecruiterLiteModule, // Import to gt RecruiterRepository access potentially, but better to import module exporting repository
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
			provide: JOB_TOKEN.CREATE_JOB_USE_CASE,
			useClass: CreateJobUseCase,
		},
	],
	exports: [JOB_TOKEN.JOB_REPOSITORY, JOB_TOKEN.CREATE_JOB_USE_CASE],
})
export class JobModule {}
