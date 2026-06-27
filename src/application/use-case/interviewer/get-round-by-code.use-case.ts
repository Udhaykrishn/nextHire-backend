import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";

@Injectable()
export class GetRoundByCodeUseCase {
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
