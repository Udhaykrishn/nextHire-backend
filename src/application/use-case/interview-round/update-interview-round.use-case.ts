import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { UpdateInterviewRoundDto } from "@/application/dto/interview-round/interview-round.dto";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class UpdateInterviewRoundUseCase implements IExecutable<UpdateInterviewRoundDto, InterviewRoundEntity> {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(dto: UpdateInterviewRoundDto): Promise<InterviewRoundEntity> {
		const round = await this._roundRepository.findById(dto.roundId as string);
		if (!round) {
			throw new NotFoundException("Interview round not found");
		}

		// Recreate using entity to retain existing unmodified fields
		const updatedRound = InterviewRoundEntity.create({
			id: round.id,
			applicationId: round.applicationId,
			interviewerIds: dto.interviewerIds || round.interviewerIds,
			templateId: dto.templateId || round.templateId,
			title: dto.title || round.title,
			type: dto.type || round.type,
			timeZone: dto.timeZone || round.timeZone,
			instructions: dto.instructions !== undefined ? dto.instructions : round.instructions,
			internalNotes: dto.internalNotes !== undefined ? dto.internalNotes : round.internalNotes,
			scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : round.scheduledAt,
			status: round.status,
			meetingCode: round.meetingCode,
			duration: dto.duration || round.duration,
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
