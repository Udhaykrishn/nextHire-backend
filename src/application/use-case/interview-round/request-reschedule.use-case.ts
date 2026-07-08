import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { RequestRescheduleDto } from "@/application/dto/interview-round/interview-round.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class RequestRescheduleUseCase implements IExecutable<RequestRescheduleDto, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) { }

	async execute(dto: RequestRescheduleDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(dto.roundId as string);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		round.reschedule(new Date(dto.newScheduledAt));

		// Optionally trigger a notification to the HR team here.

		// In a real application, we might want to store the requested time separately
		// and only apply it when approved. For simplicity, we apply it and set the status.
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
			status: "RESCHEDULED",
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
