import { Injectable, NotFoundException, BadRequestException, Inject } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { JOB_TOKEN } from "@/application/enums/tokens/job-token.enum";
import type { IJobApplicationRepository } from "@/application/interface/repository/job-application-repository.interface";
import { JobApplicationEntity, APPLICATION_STATUS } from "@/domain/entity/job-application.entity";
import { CANDIDATE_INTERVIEW_STATUS } from "@/domain/enums/interview-round/interview-status.enum";

import { SubmitFeedbackDto } from "@/application/dto/interview-round/interview-round.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class SubmitFeedbackUseCase implements IExecutable<SubmitFeedbackDto, InterviewRoundEntity> {
	constructor(
		private readonly _roundRepository: InterviewRoundRepository,
		@Inject(JOB_TOKEN.JOB_APPLICATION_REPOSITORY)
		private readonly _jobApplicationRepository: IJobApplicationRepository<JobApplicationEntity>,
	) {}

	async execute(dto: SubmitFeedbackDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(dto.roundId as string);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		// Evaluation is only allowed once HR has ended the session.
		if (!round.canBeEvaluated) {
			throw new BadRequestException("This interview can't be evaluated yet. HR must end the session first.");
		}

		const ratingMap = new Map<string, number>();
		for (const [key, value] of Object.entries(dto.rubricRatings)) {
			ratingMap.set(key, value);
		}

		round.complete(dto.score, dto.feedback, ratingMap);
		round.setCandidateStatus(dto.candidateStatus);

		const updatedRound = await this._roundRepository.findByIdAndUpdate(round.id as string, round);
		if (!updatedRound) {
			throw new NotFoundException("Failed to update interview round");
		}

		const application = await this._jobApplicationRepository.findById(round.applicationId);
		if (application) {
			if (dto.candidateStatus === CANDIDATE_INTERVIEW_STATUS.REJECTED) {
				application.changeStatus(APPLICATION_STATUS.REJECTED);
			} else {
				application.changeStatus(APPLICATION_STATUS.SHORTLISTED);
			}
			await this._jobApplicationRepository.findByIdAndUpdate(round.applicationId, application);
		}

		return updatedRound;
	}
}
