import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common";
import type { Request } from "express";
import { AuthGuard, RoleGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { ROLES, INTERVIEWER_ROUTERS } from "@/presentation/enums";
import { SubmitFeedbackDto } from "@/application/dto/interview-round/interview-round.dto";

import { ListAssignedRoundsUseCase } from "@/application/use-case/interview-round/list-assigned-rounds.use-case";
import { SubmitFeedbackUseCase } from "@/application/use-case/interview-round/submit-feedback.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Controller(INTERVIEWER_ROUTERS.INTERVIEWER_ROUNDS)
export class InterviewerInterviewController {
	constructor(
		private readonly _listAssignedRoundsUseCase: ListAssignedRoundsUseCase,
		private readonly _submitFeedbackUseCase: SubmitFeedbackUseCase,
	) {}

	@Roles(ROLES.INTERVIEWER)
	@Get(INTERVIEWER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.OK)
	async listAssignedRounds(@Req() req: Request) {
		return this._listAssignedRoundsUseCase.execute(req.user.id);
	}

	@Roles(ROLES.INTERVIEWER, ROLES.RECRUITER)
	@Post(INTERVIEWER_ROUTERS.FEEDBACK)
	@HttpCode(HttpStatus.OK)
	async submitFeedback(@Param("roundId") roundId: string, @Body() dto: Omit<SubmitFeedbackDto, "roundId">) {
		return this._submitFeedbackUseCase.execute({
			...dto,
			roundId,
		});
	}
}
