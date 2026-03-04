import {
	UserLoginDto,
	UserLoginResponseDto,
	ForgotPasswordDto,
	ForgotPasswordResponseDto,
	ResetPasswordDto,
	ResetPasswordResponseDto,
} from "@/application/dto/auth/users";
import { VerifyOTPDto, VerifyResponseOTPDto } from "@/application/dto/auth/otp";
import { UserRefreshTokenDto } from "@/application/dto/auth/users/refresh-token-res.dto";
import { UserSignResponseDto } from "@/application/dto/auth/users/signup/user-signup-res.dto";
import { UserSignupDto } from "@/application/dto/auth/users/signup/user-signup.dto";
import { AUTH_USER_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { AUTH_TOKEN } from "@/presentation/enums";
import { USER_AUTH_ROUTER } from "@/presentation/enums/user-auth-router.enum";
import { RefreshGuard } from "@/presentation/guards";

import { clearCookie, setCookie } from "@/presentation/utils/cookie-helper.util";

import { Body, Controller, Inject, Post, Req, Res, UseGuards } from "@nestjs/common";
import type { Response, Request } from "express";
import { GoogleAuthDto } from "@/application/dto/auth/users/login/auth-login.dto";
import { IAuthUserController } from "../interface/auth.interface";

@Controller(USER_AUTH_ROUTER.ROUTER)
export class AuthUserController implements IAuthUserController {
	constructor(
		@Inject(AUTH_USER_TOKEN.USER_LOGIN_USE_CASE)
		private readonly _loginUseCase: IExecutable<UserLoginDto, UserLoginResponseDto>,
		@Inject(AUTH_USER_TOKEN.USER_REFRESH_USE_CASE)
		private readonly _refreshToken: IExecutable<string, UserRefreshTokenDto>,
		@Inject(AUTH_USER_TOKEN.USER_REGISTER_USE_CASE)
		private readonly _signupUseCase: IExecutable<UserSignupDto, UserSignResponseDto>,
		@Inject(AUTH_USER_TOKEN.USER_VERIFY_OTP_USE_CASE)
		private readonly _verifyOtp: IExecutable<VerifyOTPDto, VerifyResponseOTPDto>,
		@Inject(AUTH_USER_TOKEN.USER_RESEND_OTP_USE_CASE)
		private readonly _resendOtp: IExecutable<{ email: string }, { otp: string }>,
		@Inject(AUTH_USER_TOKEN.USER_LOGOUT_USE_CASE)
		private readonly _logoutUseCase: IExecutable<string, boolean>,

		@Inject(AUTH_USER_TOKEN.USER_GOOGLE_AUTH_CASE)
		private readonly _googleAuthUseCase: IExecutable<GoogleAuthDto, UserLoginResponseDto>,

		@Inject(AUTH_USER_TOKEN.USER_FORGOT_PASSWORD_USE_CASE)
		private readonly _forgotPasswordUseCase: IExecutable<ForgotPasswordDto, ForgotPasswordResponseDto>,

		@Inject(AUTH_USER_TOKEN.USER_RESET_PASSWORD_USE_CASE)
		private readonly _resetPasswordUseCase: IExecutable<ResetPasswordDto, ResetPasswordResponseDto>,
		@Inject(AUTH_USER_TOKEN.USER_VERIFY_RESET_TOKEN_USE_CASE)
		private readonly _verifyResetTokenUseCase: IExecutable<string, boolean>,
	) {}

	@Post(USER_AUTH_ROUTER.VERIFY_RESET_TOKEN)
	async verifyResetToken(@Body() body: { token: string }) {
		return await this._verifyResetTokenUseCase.execute(body.token);
	}

	@Post(USER_AUTH_ROUTER.FORGOT_PASSWORD)
	async forgotPassword(@Body() dto: ForgotPasswordDto) {
		return await this._forgotPasswordUseCase.execute(dto);
	}

	@Post(USER_AUTH_ROUTER.RESET_PASSWORD)
	async resetPassword(@Body() dto: ResetPasswordDto) {
		return await this._resetPasswordUseCase.execute(dto);
	}

	@Post(USER_AUTH_ROUTER.LOGIN)
	async login(@Res({ passthrough: true }) res: Response, @Body() loginDto: UserLoginDto) {
		const user = await this._loginUseCase.execute(loginDto);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, user.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		setCookie(res, AUTH_TOKEN.SESSION_ID, user.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return user;
	}

	@Post(USER_AUTH_ROUTER.SIGNUP)
	async signup(@Body() signupData: UserSignupDto) {
		return await this._signupUseCase.execute(signupData);
	}

	@UseGuards(RefreshGuard)
	@Post(USER_AUTH_ROUTER.REFRESH)
	async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const token = await this._refreshToken.execute(req.sessionId);
		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, token.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		return { success: true };
	}

	@UseGuards(RefreshGuard)
	@Post(USER_AUTH_ROUTER.LOGOUT)
	async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const isLogout = await this._logoutUseCase.execute(req.sessionId);
		if (isLogout) {
			clearCookie(res, AUTH_TOKEN.SESSION_ID);
			clearCookie(res, AUTH_TOKEN.ACCESS_TOKEN);
		}
	}

	@Post(USER_AUTH_ROUTER.OTP_VERIFY)
	async verifyOtp(@Res({ passthrough: true }) res: Response, @Body() otpDto: VerifyOTPDto) {
		const otp = await this._verifyOtp.execute(otpDto);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, otp.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		setCookie(res, AUTH_TOKEN.SESSION_ID, otp.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return otp;
	}

	@Post(USER_AUTH_ROUTER.OTP_RESEND)
	async resendOtp(@Body() data: { email: string }): Promise<{ otp: string }> {
		const otp = await this._resendOtp.execute(data);

		return otp;
	}

	@Post(USER_AUTH_ROUTER.GOOGLE)
	async googleAuth(@Res({ passthrough: true }) res: Response, @Body() googleData: GoogleAuthDto) {
		const user = await this._googleAuthUseCase.execute(googleData);

		setCookie(res, AUTH_TOKEN.ACCESS_TOKEN, user.accessToken, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		setCookie(res, AUTH_TOKEN.SESSION_ID, user.sessionId, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		return user;
	}
}
