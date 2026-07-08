import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Response, Request } from "express";
import { AuthGuard, RoleGuard, RefreshGuard } from "@/presentation/guards";
import { Roles, Public } from "@/presentation/decorators";
import { ROLES, AUTH_TOKEN, INTERVIEWER_ROUTERS } from "@/presentation/enums";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { setCookie, clearCookie } from "@/presentation/utils/cookie-helper.util";

import { InterviewerLoginUseCase } from "@/application/use-case/interviewer/interviewer-login.use-case";
import { InterviewerRefreshUseCase } from "@/application/use-case/interviewer/interviewer-refresh.use-case";
import { GetInterviewerProfileUseCase } from "@/application/use-case/interviewer/get-interviewer-profile.use-case";

@UseGuards(AuthGuard, RoleGuard)
@Controller()
export class InterviewerAuthProfileController {
	constructor(
		private readonly _loginUseCase: InterviewerLoginUseCase,
		private readonly _refreshUseCase: InterviewerRefreshUseCase,
		private readonly _getProfileUseCase: GetInterviewerProfileUseCase,
	) {}

	@Public()
	@Post(INTERVIEWER_ROUTERS.AUTH_INTERVIEWER_LOGIN)
	@HttpCode(HttpStatus.OK)
	async login(@Res({ passthrough: true }) res: Response, @Body() body: { email: string; password?: string }) {
		const result = await this._loginUseCase.execute({ email: body.email, password: body.password });
		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, result.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		setCookie(res, AUTH_TOKEN.SESSION_ID, result.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);
		return result;
	}

	@Post(INTERVIEWER_ROUTERS.AUTH_INTERVIEWER_LOGOUT)
	@HttpCode(HttpStatus.OK)
	async logout(@Res({ passthrough: true }) res: Response) {
		clearCookie(res, AUTH_TOKEN.SESSION_ID);
		clearCookie(res, AUTH_TOKEN.ACCESS_TOKEN);
		return { message: "Logged out successfully" };
	}

	@Public()
	@UseGuards(RefreshGuard)
	@Post(INTERVIEWER_ROUTERS.AUTH_INTERVIEWER_REFRESH)
	@HttpCode(HttpStatus.OK)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const result = await this._refreshUseCase.execute(req.sessionId);
		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, result.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		setCookie(res, AUTH_TOKEN.SESSION_ID, result.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);
		return { success: true };
	}

	@Roles(ROLES.INTERVIEWER)
	@Get(INTERVIEWER_ROUTERS.INTERVIEWER_PROFILE)
	@HttpCode(HttpStatus.OK)
	async getProfile(@Req() req: Request) {
		return this._getProfileUseCase.execute(req.user.email);
	}
}
