import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Patch,
	Req,
	Res,
	UseGuards,
} from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthGuard, RoleGuard, RefreshGuard } from "@/presentation/guards";
import { Roles, Public } from "@/presentation/decorators";
import { ROLES } from "@/presentation/enums";
import { AUTH_TOKEN } from "@/presentation/enums";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { setCookie, clearCookie } from "@/presentation/utils/cookie-helper.util";

import { InterviewerEntity } from "@/domain/entity/interviewer.entity";
import { InterviewerTemplateEntity } from "@/domain/entity/interviewer-template.entity";
import { InterviewRoundEntity } from "@/domain/entity/interview-round.entity";
import { CreateInterviewerUseCase } from "@/application/use-case/interviewer/create-interviewer.use-case";
import { ListInterviewersUseCase } from "@/application/use-case/interviewer/list-interviewers.use-case";
import { DeleteInterviewerUseCase } from "@/application/use-case/interviewer/delete-interviewer.use-case";
import { CreateTemplateUseCase } from "@/application/use-case/interviewer/create-template.use-case";
import { ListTemplatesUseCase } from "@/application/use-case/interviewer/list-templates.use-case";
import { DeleteTemplateUseCase } from "@/application/use-case/interviewer/delete-template.use-case";
import { UpdateTemplateUseCase } from "@/application/use-case/interviewer/update-template.use-case";
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
		private readonly _createInterviewerUseCase: CreateInterviewerUseCase,
		private readonly _listInterviewersUseCase: ListInterviewersUseCase,
		private readonly _deleteInterviewerUseCase: DeleteInterviewerUseCase,
		private readonly _createTemplateUseCase: CreateTemplateUseCase,
		private readonly _listTemplatesUseCase: ListTemplatesUseCase,
		private readonly _deleteTemplateUseCase: DeleteTemplateUseCase,
		private readonly _updateTemplateUseCase: UpdateTemplateUseCase,
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

	// Maps a raw InterviewerEntity to a clean response shape.
	// Without this the controller serializes the entity's private fields
	// (_id, _email, ...) and leaks the password; frontend expects { id, email, ... }.
	private toInterviewerResponse(entity: InterviewerEntity) {
		return {
			id: entity.id,
			email: entity.email,
			department: entity.department,
			createdBy: entity.createdBy,
			createdAt: entity.createdAt,
		};
	}

	// Same reason as toInterviewerResponse: serializing the raw entity leaks
	// private _-prefixed fields, so frontend reads `_rubric`/`_name` as undefined.
	private toTemplateResponse(entity: InterviewerTemplateEntity) {
		return {
			id: entity.id,
			companyId: entity.companyId,
			name: entity.name,
			description: entity.description,
			duration: entity.duration,
			rubric: entity.rubric,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
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
	@Post("recruiter/interviewers")
	@HttpCode(HttpStatus.CREATED)
	async createInterviewer(
		@Req() req: Request,
		@Body() body: { email: string; department: string; password?: string },
	) {
		const interviewer = await this._createInterviewerUseCase.execute({
			email: body.email,
			department: body.department,
			password: body.password,
			companyId: req.user.id,
			createdBy: req.user.email,
		});
		return this.toInterviewerResponse(interviewer);
	}

	@Roles(ROLES.RECRUITER)
	@Get("recruiter/interviewers")
	@HttpCode(HttpStatus.OK)
	async listInterviewers(@Req() req: Request) {
		const interviewers = await this._listInterviewersUseCase.execute(req.user.id);
		return interviewers.map((i) => this.toInterviewerResponse(i));
	}

	@Roles(ROLES.RECRUITER)
	@Delete("recruiter/interviewers/:id")
	@HttpCode(HttpStatus.OK)
	async deleteInterviewer(@Param("id") id: string) {
		const success = await this._deleteInterviewerUseCase.execute(id);
		return { success };
	}

	@Roles(ROLES.RECRUITER)
	@Post("recruiter/templates")
	@HttpCode(HttpStatus.CREATED)
	async createTemplate(
		@Req() req: Request,
		@Body() body: { name: string; description?: string; duration: number; rubric: string[] },
	) {
		const template = await this._createTemplateUseCase.execute({
			companyId: req.user.id,
			name: body.name,
			description: body.description,
			duration: Number(body.duration),
			rubric: body.rubric,
		});
		return this.toTemplateResponse(template);
	}

	@Roles(ROLES.RECRUITER)
	@Get("recruiter/templates")
	@HttpCode(HttpStatus.OK)
	async listTemplates(@Req() req: Request) {
		const templates = await this._listTemplatesUseCase.execute(req.user.id);
		return templates.map((t) => this.toTemplateResponse(t));
	}

	@Roles(ROLES.RECRUITER)
	@Delete("recruiter/templates/:id")
	@HttpCode(HttpStatus.OK)
	async deleteTemplate(@Param("id") id: string) {
		const success = await this._deleteTemplateUseCase.execute(id);
		return { success };
	}

	@Roles(ROLES.RECRUITER)
	@Patch("recruiter/templates/:id")
	@HttpCode(HttpStatus.OK)
	async updateTemplate(
		@Req() req: Request,
		@Param("id") id: string,
		@Body() body: {
			name?: string;
			description?: string;
			duration?: number;
			rubric?: string[];
			defaultType?: string;
			defaultInstructions?: string;
		},
	) {
		const template = await this._updateTemplateUseCase.execute({
			templateId: id,
			companyId: req.user.id,
			name: body.name,
			description: body.description,
			duration: body.duration ? Number(body.duration) : undefined,
			rubric: body.rubric,
			defaultType: body.defaultType,
			defaultInstructions: body.defaultInstructions,
		});
		return this.toTemplateResponse(template);
	}

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
		return rounds.map((r) => this.toRoundResponse(r));
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
