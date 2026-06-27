import { Injectable, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";

@Injectable()
export class ListCandidateRoundsUseCase {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(candidateId: string): Promise<InterviewRoundEntity[]> {
		if (!candidateId) {
			throw new BadRequestException("Candidate ID is required");
		}

		return this._roundRepository.findByCandidateId(candidateId);
	}
}
