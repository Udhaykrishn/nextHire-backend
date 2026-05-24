import { Module } from "@nestjs/common";
import { CreateJobUseCase } from "@/application/use-case/job/create-job.use-case";
import { GetRecruiterJobsUseCase } from "@/application/use-case/job/get-recruiter-jobs.use-case";
import { ApplyJobUseCase } from "@/application/use-case/job/apply-job.use-case";
import { GetAllJobsUseCase } from "@/application/use-case/job/get-all-jobs.use-case";
import { BlockUnblockJobUseCase } from "@/application/use-case/job/block-unblock-job.use-case";
import { UpdateJobUseCase } from "@/application/use-case/job/update-job.use-case";
import { GetCandidateJobsUseCase } from "@/application/use-case/job/get-candidate-jobs.use-case";
import { GetJobByIdUseCase } from "@/application/use-case/job/get-job-by-id.use-case";
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
			provide: JOB_TOKEN.UPDATE_JOB_USE_CASE,
			useClass: UpdateJobUseCase,
		},
		{
			provide: JOB_TOKEN.GET_ALL_JOBS_USE_CASE,
			useClass: GetAllJobsUseCase,
		},
		{
			provide: JOB_TOKEN.GET_CANDIDATE_JOBS_USE_CASE,
			useClass: GetCandidateJobsUseCase,
		},
		{
			provide: JOB_TOKEN.GET_JOB_BY_ID_USE_CASE,
			useClass: GetJobByIdUseCase,
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
		JOB_TOKEN.GET_CANDIDATE_JOBS_USE_CASE,
		JOB_TOKEN.GET_JOB_BY_ID_USE_CASE,
		JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE,
		JOB_TOKEN.UPDATE_JOB_USE_CASE,
	],
})
export class JobModule { }
