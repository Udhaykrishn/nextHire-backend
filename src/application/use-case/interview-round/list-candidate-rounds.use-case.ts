import { Injectable } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class ListCandidateRoundsUseCase implements IExecutable<string, InterviewRoundEntity[]> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) { }

	async execute(candidateId: string): Promise<InterviewRoundEntity[]> {
		return this._roundRepository.findByCandidateId(candidateId);
	}
}
