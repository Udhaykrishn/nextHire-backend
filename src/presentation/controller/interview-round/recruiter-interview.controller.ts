import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { ROLES, INTERVIEWER_ROUTERS } from "@/presentation/enums";
import { ScheduleRoundDto, UpdateInterviewRoundDto } from "@/application/dto/interview-round/interview-round.dto";

import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { ScheduleRoundUseCase } from "@/application/use-case/interview-round/schedule-round.use-case";
import { UpdateInterviewRoundUseCase } from "@/application/use-case/interview-round/update-interview-round.use-case";
import { ApproveRescheduleUseCase } from "@/application/use-case/interview-round/approve-reschedule.use-case";
import { ListRoundsForApplicationUseCase } from "@/application/use-case/interview-round/list-rounds-for-application.use-case";
import { EndInterviewRoundUseCase } from "@/application/use-case/interview-round/end-interview-round.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Controller(INTERVIEWER_ROUTERS.RECRUITER_ROUNDS)
export class RecruiterInterviewController {
	constructor(
		private readonly _scheduleRoundUseCase: ScheduleRoundUseCase,
		private readonly _updateInterviewRoundUseCase: UpdateInterviewRoundUseCase,
		private readonly _approveRescheduleUseCase: ApproveRescheduleUseCase,
		private readonly _listRoundsUseCase: ListRoundsForApplicationUseCase,
		private readonly _endInterviewRoundUseCase: EndInterviewRoundUseCase,
	) {}

	private toRoundResponse(entity: InterviewRoundEntity) {
		return {
			id: entity.id,
			applicationId: entity.applicationId,
			interviewerIds: entity.interviewerIds,
			templateId: entity.templateId,
			title: entity.title,
			type: entity.type,
			timeZone: entity.timeZone,
			instructions: entity.instructions,
			internalNotes: entity.internalNotes,
			scheduledAt: entity.scheduledAt,
			status: entity.status,
			meetingCode: entity.meetingCode,
			duration: entity.duration,
			candidateConfirmation: entity.candidateConfirmation,
			candidateJoined: entity.candidateJoined,
			interviewerJoined: entity.interviewerJoined,
			candidateStatus: entity.candidateStatus,
			feedback: entity.feedback,
			score: entity.score,
			rubricRatings: entity.rubricRatings,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	@Roles(ROLES.RECRUITER)
	@Post(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async scheduleRound(@Req() req: Request, @Body() body: ScheduleRoundDto) {
		const round = await this._scheduleRoundUseCase.execute({
			...body,
			recruiterId: req.user.id,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Patch(INTERVIEWER_ROUTERS.ID)
	@HttpCode(HttpStatus.OK)
	async updateRound(@Req() req: Request, @Param("id") id: string, @Body() body: UpdateInterviewRoundDto) {
		const round = await this._updateInterviewRoundUseCase.execute({
			...body,
			roundId: id,
			recruiterId: req.user.id,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Patch(INTERVIEWER_ROUTERS.APPROVE_RESCHEDULE)
	@HttpCode(HttpStatus.OK)
	async approveReschedule(@Req() req: Request, @Param("id") id: string) {
		const round = await this._approveRescheduleUseCase.execute({ roundId: id, recruiterId: req.user.id });
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Patch(INTERVIEWER_ROUTERS.END_ROUND)
	@HttpCode(HttpStatus.OK)
	async endRound(@Param("id") id: string) {
		const round = await this._endInterviewRoundUseCase.execute(id);
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Get(INTERVIEWER_ROUTERS.APPLICATION_ROUNDS)
	@HttpCode(HttpStatus.OK)
	async listRoundsForApplication(@Param("applicationId") applicationId: string) {
		return this._listRoundsUseCase.execute(applicationId);
	}
}
