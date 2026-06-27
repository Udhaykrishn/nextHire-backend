import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";

export interface JoinRoundRoomDto {
	meetingCode: string;
	role: "candidate" | "interviewer";
}

@Injectable()
export class JoinRoundRoomUseCase {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(dto: JoinRoundRoomDto): Promise<InterviewRoundEntity> {
		if (!dto.meetingCode) {
			throw new BadRequestException("Meeting code is required");
		}
		if (dto.role !== "candidate" && dto.role !== "interviewer") {
			throw new BadRequestException("Role must be candidate or interviewer");
		}

		const round = await this._roundRepository.findByMeetingCode(dto.meetingCode);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		if (dto.role === "candidate") {
			round.joinCandidate();
		} else {
			round.joinInterviewer();
		}

		const updated = await this._roundRepository.findByIdAndUpdate(round.id as string, round);
		if (!updated) {
			throw new NotFoundException("Failed to update round join state");
		}

		return updated;
	}
}
