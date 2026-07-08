import { Injectable, BadRequestException } from "@nestjs/common";
import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { InterviewRoundRepository } from "@/infrastructure/db/mongodb/repository/interview-round/interview-round.repository";
import { INTERVIEW_ROUND_STATUS, CANDIDATE_INTERVIEW_STATUS, CANDIDATE_CONFIRMATION_STATUS } from "@/domain/enums/interview-round/interview-status.enum";

import { ScheduleRoundDto } from "@/application/dto/interview-round/interview-round.dto";

function generateMeetingCode(): string {
	const chars = "abcdefghijklmnopqrstuvwxyz";
	const rand = (len: number) =>
		Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
	return `${rand(3)}-${rand(4)}-${rand(3)}`;
}

import { SubscriptionHistoryRepository } from "@/infrastructure/db/mongodb/repository/subscription-history.repository";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { Inject } from "@nestjs/common";

import type { IExecutable } from "@/application/interface/executable.interface";

@Injectable()
export class ScheduleRoundUseCase implements IExecutable<ScheduleRoundDto, InterviewRoundEntity> {
	constructor(
		private readonly _roundRepository: InterviewRoundRepository,
		@Inject(RECRUITER_TOKEN.SUBSCRIPTION_HISTORY_REPOSITORY)
		private readonly _subscriptionRepository: SubscriptionHistoryRepository,
	) {}

	async execute(dto: ScheduleRoundDto): Promise<InterviewRoundEntity> {
		// Enforce Subscription Limits
		const subscriptions = await this._subscriptionRepository.findByUserId(dto.recruiterId as string);
		let plan = "FREE";
		if (subscriptions && subscriptions.length > 0) {
			// Find the active subscription if multiple exist
			const activeSub = subscriptions.find((sub) => sub.status === "ACTIVE" || sub.status === "succeeded");
			if (activeSub) {
				plan = activeSub.role || activeSub.payment_method;
			}
		}

		// Define limits (assumed defaults since none were provided)
		const PLAN_LIMITS: Record<string, number> = {
			FREE: 5,
			PRO: 50,
			ENTERPRISE: 999999,
		};

		const limit = PLAN_LIMITS[plan.toUpperCase()] || 5;
		const existingRounds = await this._roundRepository.findAll();
		// In a real scenario we'd count rounds for this specific company.
		// For now we'll do a basic check to prevent abuse.
		if (existingRounds.length >= limit) {
			throw new BadRequestException("Interview round creation limit reached for your current subscription plan");
		}

		const round = InterviewRoundEntity.create({
			applicationId: dto.applicationId,
			interviewerIds: dto.interviewerIds,
			templateId: dto.templateId,
			title: dto.title,
			type: dto.type || "VIDEO",
			timeZone: dto.timeZone,
			instructions: dto.instructions,
			internalNotes: dto.internalNotes,
			scheduledAt: new Date(dto.scheduledAt),
			status: INTERVIEW_ROUND_STATUS.SCHEDULED,
			meetingCode: generateMeetingCode(),
			duration: dto.duration || 45,
			candidateConfirmation: CANDIDATE_CONFIRMATION_STATUS.PENDING,
			candidateJoined: false,
			interviewerJoined: false,
			candidateStatus: CANDIDATE_INTERVIEW_STATUS.PENDING,
		});

		return this._roundRepository.save(round);
	}
}
