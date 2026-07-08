import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { JoinRoundRoomDto } from "@/application/dto/interview-round/interview-round.dto";
import type { IExecutable } from "@/application/interface/executable.interface";

// The room opens shortly before the scheduled time and stays open through the
// interview plus a grace period, so neither side can join at the wrong time.
const EARLY_JOIN_MINUTES = 15;
const GRACE_AFTER_MINUTES = 60;

@Injectable()
export class JoinRoundRoomUseCase implements IExecutable<JoinRoundRoomDto, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) { }

	async execute(dto: JoinRoundRoomDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findByMeetingCode(dto.meetingCode);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		if (round.status === "CANCELLED") {
			throw new BadRequestException("This interview was cancelled.");
		}
		if (round.status === "COMPLETED") {
			throw new BadRequestException("This interview is already completed.");
		}

		// Nobody enters until the candidate accepts the proposed time — the
		// interviewer/recruiter must wait for confirmation too.
		if (round.candidateConfirmation !== "CONFIRMED") {
			throw new ForbiddenException(
				dto.role === "candidate"
					? "Please confirm the interview time before joining the room."
					: "The candidate hasn't confirmed this interview time yet. You can join once they accept.",
			);
		}

		const start = new Date(round.scheduledAt).getTime();
		const opensAt = start - EARLY_JOIN_MINUTES * 60_000;
		const closesAt = start + (round.duration + GRACE_AFTER_MINUTES) * 60_000;
		const now = Date.now();

		if (now < opensAt) {
			throw new ForbiddenException(
				`The interview room isn't open yet. You can join from ${new Date(opensAt).toISOString()}.`,
			);
		}
		if (now > closesAt) {
			throw new ForbiddenException("The interview window has ended.");
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
