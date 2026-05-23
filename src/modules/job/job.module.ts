import { Module } from "@nestjs/common";
import { CreateJobUseCase } from "@/application/use-case/job/create-job.use-case";
import { GetRecruiterJobsUseCase } from "@/application/use-case/job/get-recruiter-jobs.use-case";
import { ApplyJobUseCase } from "@/application/use-case/job/apply-job.use-case";
import { GetAllJobsUseCase } from "@/application/use-case/job/get-all-jobs.use-case";
import { BlockUnblockJobUseCase } from "@/application/use-case/job/block-unblock-job.use-case";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";
import { JobLiteModule } from "./job-lite.module";
import { UserLiteModule } from "../user/user-db.module";
import { JobController } from "@/presentation/controller/job/implements/job.controller";

@Module({
	imports: [RecruiterLiteModule, JobLiteModule, UserLiteModule],
	controllers: [JobController],
	providers: [
		{
			provide: JOB_TOKEN.CREATE_JOB_USE_CASE,
			useClass: CreateJobUseCase,
		},
		{
			provide: JOB_TOKEN.GET_RECRUITER_JOBS_USE_CASE,
			useClass: GetRecruiterJobsUseCase,
		},
		{
			provide: JOB_TOKEN.APPLY_JOB_USE_CASE,
			useClass: ApplyJobUseCase,
		},
		{
			provide: JOB_TOKEN.GET_ALL_JOBS_USE_CASE,
			useClass: GetAllJobsUseCase,
		},
		{
			provide: JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE,
			useClass: BlockUnblockJobUseCase,
		},
	],
	exports: [
		JobLiteModule,
		JOB_TOKEN.CREATE_JOB_USE_CASE,
		JOB_TOKEN.GET_RECRUITER_JOBS_USE_CASE,
		JOB_TOKEN.GET_ALL_JOBS_USE_CASE,
		JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE,
	],
})
export class JobModule { }
