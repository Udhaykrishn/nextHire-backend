import { Module } from "@nestjs/common";
import { CreateJobUseCase } from "@/application/use-case/job/create-job.use-case";
import { GetRecruiterJobsUseCase } from "@/application/use-case/job/get-recruiter-jobs.use-case";
import { ApplyJobUseCase } from "@/application/use-case/job/apply-job.use-case";
import { GetAllJobsUseCase } from "@/application/use-case/job/get-all-jobs.use-case";
import { BlockUnblockJobUseCase } from "@/application/use-case/job/block-unblock-job.use-case";
import { UpdateJobUseCase } from "@/application/use-case/job/update-job.use-case";
import { GetCandidateJobsUseCase } from "@/application/use-case/job/get-candidate-jobs.use-case";
import { GetCandidateApplicationsUseCase } from "@/application/use-case/job/get-candidate-applications.use-case";
import { GetJobByIdUseCase } from "@/application/use-case/job/get-job-by-id.use-case";
import { GetJobStatsUseCase } from "@/application/use-case/job/get-job-stats.use-case";
import { GetJobApplicationsUseCase } from "@/application/use-case/job/get-job-applications.use-case";
import { UpdateApplicationStatusUseCase } from "@/application/use-case/job/update-application-status.use-case";
import { BulkUpdateApplicationStatusUseCase } from "@/application/use-case/job/bulk-update-application-status.use-case";
import { CalculateMatchScoreUseCase } from "@/application/use-case/job/calculate-match-score.use-case";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";
import { JobLiteModule } from "./job-lite.module";
import { UserLiteModule } from "../user/user-db.module";
import { JobController } from "@/presentation/controller/job/implements/job.controller";
import { CommonModule } from "../common.module";
import { BullModule } from "@nestjs/bullmq";
import { AiMatchingQueueProcessor } from "@/infrastructure/queue/ai-matching-queue.processor";

@Module({
	imports: [
		RecruiterLiteModule, 
		JobLiteModule, 
		UserLiteModule, 
		CommonModule,
		BullModule.registerQueue({
			name: "ai-matching-queue",
		}),
	],
	controllers: [JobController],
	providers: [
		AiMatchingQueueProcessor,
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
			provide: JOB_TOKEN.GET_CANDIDATE_APPLICATIONS_USE_CASE,
			useClass: GetCandidateApplicationsUseCase,
		},
		{
			provide: JOB_TOKEN.GET_JOB_BY_ID_USE_CASE,
			useClass: GetJobByIdUseCase,
		},
		{
			provide: JOB_TOKEN.GET_JOB_STATS_USE_CASE,
			useClass: GetJobStatsUseCase,
		},
		{
			provide: JOB_TOKEN.GET_JOB_APPLICATIONS_USE_CASE,
			useClass: GetJobApplicationsUseCase,
		},
		{
			provide: JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE,
			useClass: BlockUnblockJobUseCase,
		},
		{
			provide: JOB_TOKEN.UPDATE_APPLICATION_STATUS_USE_CASE,
			useClass: UpdateApplicationStatusUseCase,
		},
		{
			provide: JOB_TOKEN.CALCULATE_MATCH_SCORE_USE_CASE,
			useClass: CalculateMatchScoreUseCase,
		},
		{
			provide: JOB_TOKEN.BULK_UPDATE_APPLICATION_STATUS_USE_CASE,
			useClass: BulkUpdateApplicationStatusUseCase,
		},
	],
	exports: [
		JobLiteModule,
		JOB_TOKEN.CREATE_JOB_USE_CASE,
		JOB_TOKEN.GET_RECRUITER_JOBS_USE_CASE,
		JOB_TOKEN.GET_ALL_JOBS_USE_CASE,
		JOB_TOKEN.GET_CANDIDATE_JOBS_USE_CASE,
		JOB_TOKEN.GET_JOB_BY_ID_USE_CASE,
		JOB_TOKEN.GET_JOB_STATS_USE_CASE,
		JOB_TOKEN.GET_JOB_APPLICATIONS_USE_CASE,
		JOB_TOKEN.BLOCK_UNBLOCK_JOB_USE_CASE,
		JOB_TOKEN.UPDATE_JOB_USE_CASE,
		JOB_TOKEN.UPDATE_APPLICATION_STATUS_USE_CASE,
		JOB_TOKEN.BULK_UPDATE_APPLICATION_STATUS_USE_CASE,
		JOB_TOKEN.CALCULATE_MATCH_SCORE_USE_CASE,
	],
})
export class JobModule { }
