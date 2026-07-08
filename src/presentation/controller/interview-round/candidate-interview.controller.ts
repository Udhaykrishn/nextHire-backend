import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { ROLES, INTERVIEWER_ROUTERS } from "@/presentation/enums";
import { ConfirmRoundDto, RequestRescheduleDto } from "@/application/dto/interview-round/interview-round.dto";

import { InterviewRoundEntity } from "@/domain/entity/interview-round/interview-round.entity";
import { RequestRescheduleUseCase } from "@/application/use-case/interview-round/request-reschedule.use-case";
import { ConfirmRoundUseCase } from "@/application/use-case/interview-round/confirm-round.use-case";
import { ListCandidateRoundsUseCase } from "@/application/use-case/interview-round/list-candidate-rounds.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Controller(INTERVIEWER_ROUTERS.CANDIDATE_ROUNDS)
export class CandidateInterviewController {
	constructor(
		private readonly _requestRescheduleUseCase: RequestRescheduleUseCase,
		private readonly _confirmRoundUseCase: ConfirmRoundUseCase,
		private readonly _listCandidateRoundsUseCase: ListCandidateRoundsUseCase,
	) {}

	private toRoundResponse(entity: InterviewRoundEntity) {
		return {
			id: entity.id, applicationId: entity.applicationId, interviewerIds: entity.interviewerIds,
			templateId: entity.templateId, title: entity.title, type: entity.type, timeZone: entity.timeZone,
			instructions: entity.instructions, internalNotes: entity.internalNotes, scheduledAt: entity.scheduledAt,
			status: entity.status, meetingCode: entity.meetingCode, duration: entity.duration,
			candidateConfirmation: entity.candidateConfirmation, candidateJoined: entity.candidateJoined,
			interviewerJoined: entity.interviewerJoined, candidateStatus: entity.candidateStatus,
			feedback: entity.feedback, score: entity.score, rubricRatings: entity.rubricRatings,
			createdAt: entity.createdAt, updatedAt: entity.updatedAt,
		};
	}

	@Roles(ROLES.USER)
	@Get(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.OK)
	async getCandidateRounds(@Req() req: Request) {
		const rounds = await this._listCandidateRoundsUseCase.execute(req.user.id);
		return rounds.map((r) => this.toRoundResponse(r));
	}

	@Roles(ROLES.USER)
	@Patch(INTERVIEWER_ROUTERS.CONFIRM)
	@HttpCode(HttpStatus.OK)
	async confirmRound(@Param("roundId") roundId: string, @Body() dto: ConfirmRoundDto) {
		const round = await this._confirmRoundUseCase.execute({
			...dto,
			roundId,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.USER, ROLES.INTERVIEWER)
	@Patch(INTERVIEWER_ROUTERS.RESCHEDULE)
	@HttpCode(HttpStatus.OK)
	async requestReschedule(
		@Req() req: Request,
		@Param("roundId") roundId: string,
		@Body() dto: RequestRescheduleDto,
	) {
		const round = await this._requestRescheduleUseCase.execute({
			...dto,
			roundId,
			requestedByUserId: req.user.id,
		});
		return this.toRoundResponse(round);
	}
}
