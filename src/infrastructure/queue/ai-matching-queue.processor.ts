import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger, Inject } from "@nestjs/common";
import { Job } from "bullmq";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { CalculateMatchScoreDto } from "@/application/use-case/job/calculate-match-score.use-case";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import type { JobApplicationEntity } from "@/domain/entity/job-application.entity";

interface AiMatchingJobData {
	applicationId: string;
	jobId: string;
	candidateId: string;
}

@Processor("ai-matching-queue")
export class AiMatchingQueueProcessor extends WorkerHost {
	private readonly logger = new Logger(AiMatchingQueueProcessor.name);

	constructor(
		@Inject(JOB_TOKEN.CALCULATE_MATCH_SCORE_USE_CASE)
		private readonly _calculateMatchScoreUseCase: IExecutable<
			CalculateMatchScoreDto,
			{ matchScore: number; breakdown: Record<string, unknown> }
		>,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) {
		super();
	}

	async process(job: Job<AiMatchingJobData, void, string>): Promise<void> {
		this.logger.log(`Processing AI matching job ${job.id} for application ${job.data.applicationId}`);
		const { applicationId, jobId, candidateId } = job.data;

		try {
			// Calculate the match score via AI
			const scoreResult = await this._calculateMatchScoreUseCase.execute({
				jobId,
				candidateId,
			});
			const matchScore = scoreResult.matchScore || 0;

			const application = await this._jobApplicationRepository.findById(applicationId);
			if (!application) {
				this.logger.error(`Application ${applicationId} not found during AI matching process.`);
				return;
			}

			application.changeMatchScore(matchScore);

			await this._jobApplicationRepository.findByIdAndUpdate(applicationId, application);
			this.logger.log(`Successfully updated match score for application ${applicationId} to ${matchScore}`);
		} catch (error) {
			this.logger.error(`Failed to process AI matching for application ${applicationId}:`, error);
			throw error;
		}
	}
}
