import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";

import { ApproveRescheduleDto } from "@/application/dto/interview-round/interview-round.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class ApproveRescheduleUseCase implements IExecutable<ApproveRescheduleDto, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) { }

	async execute(dto: ApproveRescheduleDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(dto.roundId as string);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		if (round.status !== "RESCHEDULED") {
			throw new BadRequestException("This round is not currently awaiting reschedule approval");
		}

		const updatedRound = InterviewRoundEntity.create({
			id: round.id,
			applicationId: round.applicationId,
			interviewerIds: round.interviewerIds,
			templateId: round.templateId,
			title: round.title,
			type: round.type,
			timeZone: round.timeZone,
			instructions: round.instructions,
			internalNotes: round.internalNotes,
			scheduledAt: round.scheduledAt,
			status: "SCHEDULED",
			meetingCode: round.meetingCode,
			duration: round.duration,
			candidateConfirmation: round.candidateConfirmation,
			candidateJoined: round.candidateJoined,
			interviewerJoined: round.interviewerJoined,
			candidateStatus: round.candidateStatus,
			feedback: round.feedback,
			score: round.score,
			rubricRatings: round.rubricRatings,
			createdAt: round.createdAt,
			updatedAt: new Date(),
		});

		return this._roundRepository.save(updatedRound);
	}
}
