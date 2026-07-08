import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class GetRoundByCodeUseCase implements IExecutable<string, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(meetingCode: string): Promise<InterviewRoundEntity> {
		if (!meetingCode || meetingCode.trim() === "") {
			throw new BadRequestException("Meeting code is required");
		}

		const round = await this._roundRepository.findByMeetingCode(meetingCode);
		if (!round) {
			throw new NotFoundException("Interview round room not found");
		}

		return round;
	}
}
