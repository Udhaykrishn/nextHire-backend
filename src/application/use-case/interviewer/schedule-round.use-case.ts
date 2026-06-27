import { Injectable, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round.repository";

export interface ScheduleRoundDto {
	applicationId: string;
	interviewerId: string;
	templateId: string;
	scheduledAt: Date;
	duration?: number;
}

function generateMeetingCode(): string {
	const chars = "abcdefghijklmnopqrstuvwxyz";
	const rand = (len: number) =>
		Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
	return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

@Injectable()
export class ScheduleRoundUseCase {
	constructor(private readonly _roundRepository: InterviewRoundRepository) {}

	async execute(dto: ScheduleRoundDto): Promise<InterviewRoundEntity> {
		if (!dto.applicationId) {
			throw new BadRequestException("Application ID is required");
		}
		if (!dto.interviewerId) {
			throw new BadRequestException("Interviewer ID is required");
		}
		if (!dto.templateId) {
			throw new BadRequestException("Template ID is required");
		}
		if (!dto.scheduledAt) {
			throw new BadRequestException("Scheduled date/time is required");
		}

		const round = InterviewRoundEntity.create({
			applicationId: dto.applicationId,
			interviewerId: dto.interviewerId,
			templateId: dto.templateId,
			scheduledAt: new Date(dto.scheduledAt),
			status: "PENDING",
			meetingCode: generateMeetingCode(),
			duration: dto.duration || 45,
			candidateConfirmation: "PENDING",
			candidateJoined: false,
			interviewerJoined: false,
			candidateStatus: "PENDING",
		});

		return this._roundRepository.save(round);
	}
}
