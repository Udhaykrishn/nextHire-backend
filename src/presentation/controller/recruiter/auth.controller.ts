import { Body, Controller, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Response, Request } from "express";

import { AUTH_TOKEN } from "@/presentation/enums";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { RefreshGuard } from "@/presentation/guards";
import { setCookie } from "@/presentation/utils/cookie-helper.util";

import type { IExecutable } from "@/application/interface/executable.interface";
import { AUTH_RECRUITER_TOKEN } from "@/application/enums/recruiter/auth-token.enum";
import { RECRUITER_AUTH_ROUTER } from "@/presentation/enums/recuriter/auth.router";
import type { RecruiterLoginDto, RecruiterLoginResponseDto } from "@/application/dto/auth/recruiter/login";
import { RecruiterSignResponseDto, RecruiterSignupDto } from "@/application/dto/auth/recruiter/signup";
import { RecruiterRefreshTokenDto } from "@/application/dto/auth/recruiter";
import { VerifyOTPDto, VerifyResponseOTPDto } from "@/application/dto/auth/otp";

@Controller(RECRUITER_AUTH_ROUTER.ROUTER)
export class AuthRecruiterController {
	constructor(
		@Inject(AUTH_RECRUITER_TOKEN.RECRUITER_LOGIN_USE_CASE)
		private readonly _loginUseCase: IExecutable<RecruiterLoginDto, RecruiterLoginResponseDto>,

		@Inject(AUTH_RECRUITER_TOKEN.RECRUITER_REGISTER_USE_CASE)
		private readonly _signupUseCase: IExecutable<RecruiterSignupDto, RecruiterSignResponseDto>,

		@Inject(AUTH_RECRUITER_TOKEN.RECRUITER_REFRESH_USE_CASE)
		private readonly _refreshTokenUseCase: IExecutable<string, RecruiterRefreshTokenDto>,

		@Inject(AUTH_RECRUITER_TOKEN.RECRUITER_VERIFY_OTP_USE_CASE)
		private readonly __verifyOtp: IExecutable<VerifyOTPDto, VerifyResponseOTPDto>,

		// @Inject(AUTH_RECRUITER_TOKEN.RECRUITER_LOGOUT_USE_CASE)
		// private readonly _logoutUseCase: IExecutable<string, boolean>,
	) {}

	@Post(RECRUITER_AUTH_ROUTER.LOGIN)
	async login(
		@Res({ passthrough: true }) res: Response,
		@Body() loginDto: RecruiterLoginDto,
	): Promise<RecruiterLoginResponseDto> {
		const result = await this._loginUseCase.execute(loginDto);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, result.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
		setCookie(res, AUTH_TOKEN.SESSION_ID, result.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return result;
	}

	@Post(RECRUITER_AUTH_ROUTER.SIGNUP)
	async signup(@Body() signupDto: RecruiterSignupDto): Promise<RecruiterSignResponseDto> {
		return await this._signupUseCase.execute(signupDto);
	}

	@UseGuards(RefreshGuard)
	@Post(RECRUITER_AUTH_ROUTER.REFRESH)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
		const token = await this._refreshTokenUseCase.execute(req.sessionId);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, token.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);
	}

	@Post(RECRUITER_AUTH_ROUTER.OTP_VERIFY)
	async verifyOtp(@Res({ passthrough: true }) res: Response, @Body() otpDto: VerifyOTPDto) {
		const otp = await this.__verifyOtp.execute(otpDto);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, otp.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		setCookie(res, AUTH_TOKEN.SESSION_ID, otp.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return otp;
	}

	// @UseGuards(RefreshGuard)
	// @Post(RECRUITER_AUTH_ROUTER.LOGOUT)
	// async logout(
	// 	@Req() req: Request,
	// 	@Res({ passthrough: true }) res: Response,
	// ): Promise<{ message: string }> {
	// 	const success = await this._logoutUseCase.execute(req.sessionId);

	// 	if (success) {
	// 		clearCookie(res, AUTH_TOKEN.SESSION_ID);
	// 		clearCookie(res, AUTH_TOKEN.ACCESS_TOKEN);
	// 	}

	// 	return { message: "Logged out successfully" };
	// }
}
