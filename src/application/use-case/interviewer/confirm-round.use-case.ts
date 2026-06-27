import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";

export interface ConfirmRoundDto {
	roundId: string;
	status: "CONFIRMED" | "DECLINED";
}

@Injectable()
export class ConfirmRoundUseCase {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(dto: ConfirmRoundDto): Promise<InterviewRoundEntity> {
		if (!dto.roundId) {
			throw new BadRequestException("Round ID is required");
		}
		if (dto.status !== "CONFIRMED" && dto.status !== "DECLINED") {
			throw new BadRequestException("Status must be CONFIRMED or DECLINED");
		}

		const round = await this._roundRepository.findById(dto.roundId);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		round.confirm(dto.status);

		const updated = await this._roundRepository.findByIdAndUpdate(dto.roundId, round);
		if (!updated) {
			throw new NotFoundException("Failed to update round status");
		}

		return updated;
	}
}
