import { Controller, Post, Body, Get, Res, Req, UseGuards, UnauthorizedException, Inject } from "@nestjs/common";
import type { Request, Response } from "express";
import { AdminLoginUseCase } from "@/application/use-case/auth/admin/admin-login.use-case";
import { AdminRefreshUseCase } from "@/application/use-case/auth/admin/admin-refresh.use-case";
import { AdminLogoutUseCase } from "@/application/use-case/auth/admin/admin-logout.use-case";
import { ADMIN_AUTH_ROUTER } from "@/presentation/enums/admin-auth-router.enum";
import { AdminLoginDto } from "@/application/dto/auth/admin/admin-login.dto";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { AUTH_TOKEN } from "@/presentation/enums";
import { ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import { setCookie, clearCookie } from "@/presentation/utils/cookie-helper.util";
import { RefreshGuard } from "@/presentation/guards";
import { Roles } from "@/presentation/decorators";
import { USER_ROLE } from "@/domain/enums";

@Controller(ADMIN_AUTH_ROUTER.ROUTER)
export class AdminAuthController {
	constructor(
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_LOGIN_USE_CASE)
		private readonly loginUseCase: AdminLoginUseCase,
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_REFRESH_USE_CASE)
		private readonly refreshUseCase: AdminRefreshUseCase,
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_LOGOUT_USE_CASE)
		private readonly logoutUseCase: AdminLogoutUseCase,
	) { }

	@Post(ADMIN_AUTH_ROUTER.LOGIN)
	async login(@Body() dto: AdminLoginDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, sessionId } = await this.loginUseCase.execute(dto);
		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		setCookie(res, AUTH_TOKEN.SESSION_ID, sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);
		return { accessToken };
	}

	@UseGuards(RefreshGuard)
	@Get(ADMIN_AUTH_ROUTER.REFRESH)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const { accessToken } = await this.refreshUseCase.execute(req.sessionId);
		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		return { accessToken };
	}

	@UseGuards(AuthGuard)
	@Roles(USER_ROLE.ADMIN)
	@Post(ADMIN_AUTH_ROUTER.LOGOUT)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		if (!req.sessionId) {
			throw new UnauthorizedException("Missing session id");
		}
		await this.logoutUseCase.execute(req.sessionId);
		clearCookie(res, AUTH_TOKEN.SESSION_ID);
		clearCookie(res, AUTH_TOKEN.ACCESS_TOKEN);
		return { success: true };
	}
}
