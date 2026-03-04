import { UserLoginDto, UserLoginResponseDto, ForgotPasswordDto, ResetPasswordDto } from "@/application/dto/auth/users";
import { VerifyOTPDto, VerifyResponseOTPDto } from "@/application/dto/auth/otp";
import { UserSignResponseDto } from "@/application/dto/auth/users/signup/user-signup-res.dto";
import { UserSignupDto } from "@/application/dto/auth/users/signup/user-signup.dto";
import { GoogleAuthDto } from "@/application/dto/auth/users/login/auth-login.dto";
import { Request, Response } from "express";

export interface IAuthUserController {
	forgotPassword(dto: ForgotPasswordDto): Promise<UserLoginResponseDto>;
	resetPassword(dto: ResetPasswordDto): Promise<UserLoginResponseDto>;
	login(res: Response, loginDto: UserLoginDto): Promise<UserLoginResponseDto>;
	signup(signupData: UserSignupDto): Promise<UserSignResponseDto>;
	refresh(req: Request, res: Response): Promise<{ success: boolean }>;
	logout(req: Request, res: Response): Promise<void>;
	verifyOtp(res: Response, otpDto: VerifyOTPDto): Promise<VerifyResponseOTPDto>;
	resendOtp(data: { email: string }): Promise<{ otp: string }>;
	googleAuth(res: Response, googleData: GoogleAuthDto): Promise<UserLoginResponseDto>;
}
