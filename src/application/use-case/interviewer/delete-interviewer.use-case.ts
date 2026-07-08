import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";

import type { IExecutable } from "@/application/interface/executable.interface";

// Rounds in these states are finished, so an interviewer with only these can
// be safely removed. Any other state (SCHEDULED / RESCHEDULED / PENDING) is a
// live assignment — deleting would orphan the round so the interviewer could
// never see it again.
const CLOSED_ROUND_STATUSES = ["COMPLETED", "CANCELLED", "NO_SHOW"];

@Injectable()
export class DeleteInterviewerUseCase implements IExecutable<string, boolean> {
	constructor(
		private readonly _interviewerRepository: InterviewerRepository,
		private readonly _roundRepository: InterviewRoundRepository,
	) {}

	async execute(id: string): Promise<boolean> {
		const existing = await this._interviewerRepository.findById(id);
		if (!existing) {
			throw new NotFoundException("Interviewer not found");
		}

		const rounds = await this._roundRepository.findByInterviewerId(id);
		const activeRounds = rounds.filter(
			(round) => !CLOSED_ROUND_STATUSES.includes(round.status),
		);
		if (activeRounds.length > 0) {
			throw new ConflictException(
				`Cannot delete this interviewer: they are assigned to ${activeRounds.length} active interview round(s). Reassign or cancel those rounds first.`,
			);
		}

		return this._interviewerRepository.deleteById(id);
	}
}
