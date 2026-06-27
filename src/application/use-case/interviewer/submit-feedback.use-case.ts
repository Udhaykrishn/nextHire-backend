import { Injectable, NotFoundException, BadRequestException, Inject } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import { JobApplicationEntity, APPLICATION_STATUS } from "@/domain/entity/job-application.entity";

export interface SubmitFeedbackDto {
	roundId: string;
	score: number; // 1-10
	feedback: string;
	rubricRatings: Record<string, number>;
	candidateStatus: "PASS" | "REJECTED";
}

@Injectable()
export class SubmitFeedbackUseCase {
	constructor(
		private readonly _roundRepository: InterviewRoundRepository,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) {}

	async execute(dto: SubmitFeedbackDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(dto.roundId);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		if (dto.score < 1 || dto.score > 10) {
			throw new BadRequestException("Score must be between 1 and 10");
		}

		if (!dto.feedback || dto.feedback.trim() === "") {
			throw new BadRequestException("Feedback text is required");
		}

		if (dto.candidateStatus !== "PASS" && dto.candidateStatus !== "REJECTED") {
			throw new BadRequestException("Candidate status must be PASS or REJECTED");
		}

		const ratingMap = new Map<string, number>();
		for (const [key, value] of Object.entries(dto.rubricRatings)) {
			if (value < 1 || value > 10) {
				throw new BadRequestException(`Rating for ${key} must be between 1 and 10`);
			}
			ratingMap.set(key, value);
		}

		round.complete(dto.score, dto.feedback, ratingMap);
		round.setCandidateStatus(dto.candidateStatus);

		const updatedRound = await this._roundRepository.findByIdAndUpdate(dto.roundId, round);
		if (!updatedRound) {
			throw new NotFoundException("Failed to update interview round");
		}

		// Update candidate's overall application status
		const application = await this._jobApplicationRepository.findById(round.applicationId);
		if (application) {
			if (dto.candidateStatus === "REJECTED") {
				application.changeStatus(APPLICATION_STATUS.REJECTED);
			} else {
				application.changeStatus(APPLICATION_STATUS.SHORTLISTED);
			}
			await this._jobApplicationRepository.findByIdAndUpdate(round.applicationId, application);
		}

		return updatedRound;
	}
}
