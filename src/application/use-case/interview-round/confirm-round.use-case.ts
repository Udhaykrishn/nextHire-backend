import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";

import { ConfirmRoundDto } from "@/application/dto/interview-round/interview-round.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class ConfirmRoundUseCase implements IExecutable<ConfirmRoundDto, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) { }

	async execute(dto: ConfirmRoundDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(dto.roundId as string);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		round.confirm(dto.status);

		const updated = await this._roundRepository.findByIdAndUpdate(round.id as string, round);
		if (!updated) {
			throw new NotFoundException("Failed to update round status");
		}

		return updated;
	}
}
