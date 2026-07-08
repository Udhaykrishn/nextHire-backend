import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { INTERVIEW_ROUND_STATUS } from "@/domain/enums/interview-round/interview-status.enum";
import type { IExecutable } from "@/application/interface/executable.interface";

// HR/recruiter ends a live interview. Only a scheduled/rescheduled round can be
// ended; this flips it to AWAITING_EVALUATION so the interviewer can score it.
@Injectable()
export class EndInterviewRoundUseCase implements IExecutable<string, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(roundId: string): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(roundId);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		const endable: string[] = [INTERVIEW_ROUND_STATUS.SCHEDULED, INTERVIEW_ROUND_STATUS.RESCHEDULED];
		if (!endable.includes(round.status)) {
			throw new BadRequestException("Only a scheduled interview that hasn't ended yet can be ended.");
		}

		round.endForEvaluation();

		const updated = await this._roundRepository.findByIdAndUpdate(round.id as string, round);
		if (!updated) {
			throw new NotFoundException("Failed to update interview round");
		}
		return updated;
	}
}
