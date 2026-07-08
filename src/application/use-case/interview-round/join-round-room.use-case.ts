import { Injectable, NotFoundException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { JoinRoundRoomDto } from "@/application/dto/interview-round/interview-round.dto";
import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class JoinRoundRoomUseCase implements IExecutable<JoinRoundRoomDto, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) { }

	async execute(dto: JoinRoundRoomDto): Promise<InterviewRoundEntity> {
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
