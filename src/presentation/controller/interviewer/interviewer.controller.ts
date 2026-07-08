import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Patch, Req, Res, UseGuards } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthGuard, RoleGuard, RefreshGuard } from "@/presentation/guards";
import { Roles, Public } from "@/presentation/decorators";
import { ROLES } from "@/presentation/enums";
import { AUTH_TOKEN } from "@/presentation/enums";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { setCookie, clearCookie } from "@/presentation/utils/cookie-helper.util";

import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { ScheduleRoundUseCase } from "@/application/use-case/interviewer/schedule-round.use-case";
import { UpdateInterviewRoundUseCase } from "@/application/use-case/interviewer/update-interview-round.use-case";
import { RequestRescheduleUseCase } from "@/application/use-case/interviewer/request-reschedule.use-case";
import { ApproveRescheduleUseCase } from "@/application/use-case/interviewer/approve-reschedule.use-case";
import { ListRoundsForApplicationUseCase } from "@/application/use-case/interviewer/list-rounds-for-application.use-case";
import { InterviewerLoginUseCase } from "@/application/use-case/interviewer/interviewer-login.use-case";
import { InterviewerRefreshUseCase } from "@/application/use-case/interviewer/interviewer-refresh.use-case";
import { GetInterviewerProfileUseCase } from "@/application/use-case/interviewer/get-interviewer-profile.use-case";
import { ListAssignedRoundsUseCase } from "@/application/use-case/interviewer/list-assigned-rounds.use-case";
import { SubmitFeedbackUseCase } from "@/application/use-case/interviewer/submit-feedback.use-case";
import { ConfirmRoundUseCase } from "@/application/use-case/interviewer/confirm-round.use-case";
import { GetRoundByCodeUseCase } from "@/application/use-case/interviewer/get-round-by-code.use-case";
import { JoinRoundRoomUseCase } from "@/application/use-case/interviewer/join-round-room.use-case";
import { ListCandidateRoundsUseCase } from "@/application/use-case/interviewer/list-candidate-rounds.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Controller()
export class InterviewerController {
	constructor(
		private readonly _scheduleRoundUseCase: ScheduleRoundUseCase,
		private readonly _updateInterviewRoundUseCase: UpdateInterviewRoundUseCase,
		private readonly _requestRescheduleUseCase: RequestRescheduleUseCase,
		private readonly _approveRescheduleUseCase: ApproveRescheduleUseCase,
		private readonly _listRoundsUseCase: ListRoundsForApplicationUseCase,
		private readonly _loginUseCase: InterviewerLoginUseCase,
		private readonly _refreshUseCase: InterviewerRefreshUseCase,
		private readonly _getProfileUseCase: GetInterviewerProfileUseCase,
		private readonly _listAssignedRoundsUseCase: ListAssignedRoundsUseCase,
		private readonly _submitFeedbackUseCase: SubmitFeedbackUseCase,
		private readonly _confirmRoundUseCase: ConfirmRoundUseCase,
		private readonly _getRoundByCodeUseCase: GetRoundByCodeUseCase,
		private readonly _joinRoundRoomUseCase: JoinRoundRoomUseCase,
		private readonly _listCandidateRoundsUseCase: ListCandidateRoundsUseCase,
	) {}

	// Auth Interviewer
	@Public()
	@Post("auth/interviewer/login")
	@HttpCode(HttpStatus.OK)
	async login(@Res({ passthrough: true }) res: Response, @Body() body: { email: string; password?: string }) {
		const result = await this._loginUseCase.execute({
			email: body.email,
			password: body.password,
		});

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, result.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		setCookie(res, AUTH_TOKEN.SESSION_ID, result.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return result;
	}

	@Post("auth/interviewer/logout")
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		clearCookie(res, AUTH_TOKEN.SESSION_ID);
		clearCookie(res, AUTH_TOKEN.ACCESS_TOKEN);
		return { message: "Logged out successfully" };
	}

	@Public()
	@UseGuards(RefreshGuard)
	@Post("auth/interviewer/refresh")
	@HttpCode(HttpStatus.OK)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const result = await this._refreshUseCase.execute(req.sessionId);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, result.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		setCookie(res, AUTH_TOKEN.SESSION_ID, result.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return { success: true };
	}

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

	// Recruiter Actions

	@Roles(ROLES.RECRUITER)
	@Post("recruiter/interview-rounds")
	@HttpCode(HttpStatus.CREATED)
	async scheduleRound(
		@Req() req: Request,
		@Body() body: {
			applicationId: string;
			interviewerIds: string[];
			templateId: string;
			title: string;
			type: string;
			timeZone: string;
			instructions?: string;
			internalNotes?: string;
			scheduledAt: string;
		},
	) {
		const round = await this._scheduleRoundUseCase.execute({
			recruiterId: req.user.id,
			applicationId: body.applicationId,
			interviewerIds: body.interviewerIds,
			templateId: body.templateId,
			title: body.title,
			type: body.type,
			timeZone: body.timeZone,
			instructions: body.instructions,
			internalNotes: body.internalNotes,
			scheduledAt: new Date(body.scheduledAt),
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Patch("recruiter/interview-rounds/:id")
	@HttpCode(HttpStatus.OK)
	async updateRound(
		@Param("id") id: string,
		@Body() body: {
			interviewerIds?: string[];
			templateId?: string;
			title?: string;
			type?: string;
			timeZone?: string;
			instructions?: string;
			internalNotes?: string;
			scheduledAt?: string;
			duration?: number;
		},
	) {
		const round = await this._updateInterviewRoundUseCase.execute({
			roundId: id,
			interviewerIds: body.interviewerIds,
			templateId: body.templateId,
			title: body.title,
			type: body.type,
			timeZone: body.timeZone,
			instructions: body.instructions,
			internalNotes: body.internalNotes,
			scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
			duration: body.duration,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Patch("recruiter/interview-rounds/:id/approve-reschedule")
	@HttpCode(HttpStatus.OK)
	async approveReschedule(@Req() req: Request, @Param("id") id: string) {
		const round = await this._approveRescheduleUseCase.execute({
			roundId: id,
			recruiterId: req.user.id,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.RECRUITER)
	@Get("recruiter/interview-rounds/application/:applicationId")
	@HttpCode(HttpStatus.OK)
	async listRoundsForApplication(@Param("applicationId") applicationId: string) {
		const rounds = await this._listRoundsUseCase.execute(applicationId);
		return rounds;
	}

	// Interviewer Actions
	@Roles(ROLES.INTERVIEWER)
	@Get("interviewer/profile")
	@HttpCode(HttpStatus.OK)
	async getProfile(@Req() req: Request) {
		return this._getProfileUseCase.execute(req.user.email);
	}

	@Roles(ROLES.INTERVIEWER)
	@Get("interviewer/rounds")
	@HttpCode(HttpStatus.OK)
	async listAssignedRounds(@Req() req: Request) {
		return this._listAssignedRoundsUseCase.execute(req.user.id);
	}

	@Roles(ROLES.INTERVIEWER, ROLES.RECRUITER)
	@Post("interviewer/rounds/:roundId/feedback")
	@HttpCode(HttpStatus.OK)
	async submitFeedback(
		@Param("roundId") roundId: string,
		@Body() body: {
			score: number;
			feedback: string;
			rubricRatings: Record<string, number>;
			candidateStatus: "PASS" | "REJECTED";
		},
	) {
		return this._submitFeedbackUseCase.execute({
			roundId,
			score: Number(body.score),
			feedback: body.feedback,
			rubricRatings: body.rubricRatings,
			candidateStatus: body.candidateStatus,
		});
	}

	@Roles(ROLES.USER)
	@Patch("candidate/interview-rounds/:roundId/confirm")
	@HttpCode(HttpStatus.OK)
	async confirmRound(@Param("roundId") roundId: string, @Body() body: { status: "CONFIRMED" | "DECLINED" }) {
		const round = await this._confirmRoundUseCase.execute({
			roundId,
			status: body.status,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.USER, ROLES.INTERVIEWER)
	@Patch("candidate/interview-rounds/:roundId/reschedule")
	@HttpCode(HttpStatus.OK)
	async requestReschedule(
		@Req() req: Request,
		@Param("roundId") roundId: string,
		@Body() body: { newScheduledAt: string; reason?: string },
	) {
		const round = await this._requestRescheduleUseCase.execute({
			roundId,
			requestedByUserId: req.user.id,
			newScheduledAt: new Date(body.newScheduledAt),
			reason: body.reason,
		});
		return this.toRoundResponse(round);
	}

	@Roles(ROLES.USER)
	@Get("candidate/interview-rounds")
	@HttpCode(HttpStatus.OK)
	async getCandidateRounds(@Req() req: Request) {
		const rounds = await this._listCandidateRoundsUseCase.execute(req.user.id);
		return rounds.map((r) => this.toRoundResponse(r));
	}

	@Roles(ROLES.USER, ROLES.INTERVIEWER, ROLES.RECRUITER)
	@Get("room/interview-rounds/:meetingCode")
	@HttpCode(HttpStatus.OK)
	async getRoundRoom(@Param("meetingCode") meetingCode: string) {
		return this._getRoundByCodeUseCase.execute(meetingCode);
	}

	@Roles(ROLES.USER, ROLES.INTERVIEWER, ROLES.RECRUITER)
	@Post("room/interview-rounds/:meetingCode/join")
	@HttpCode(HttpStatus.OK)
	async joinRoundRoom(
		@Param("meetingCode") meetingCode: string,
		@Body() body: { role: "candidate" | "interviewer" },
	) {
		return this._joinRoundRoomUseCase.execute({
			meetingCode,
			role: body.role,
		});
	}
}
