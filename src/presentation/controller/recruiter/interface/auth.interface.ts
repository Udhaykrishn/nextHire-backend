import { RecruiterLoginDto, RecruiterLoginResponseDto } from "@/application/dto/auth/recruiter/login";
import { RecruiterSignResponseDto, RecruiterSignupDto } from "@/application/dto/auth/recruiter/signup";
import {
	RecruiterForgotPasswordDto,
	RecruiterForgotPasswordResponseDto,
	RecruiterResetPasswordDto,
	RecruiterResetPasswordResponseDto,
} from "@/application/dto/auth/recruiter";
import { VerifyOTPDto, VerifyResponseOTPDto } from "@/application/dto/auth/otp";
import { Request, Response } from "express";

export interface IAuthRecruiterController {
	forgotPassword(dto: RecruiterForgotPasswordDto): Promise<RecruiterForgotPasswordResponseDto>;
	resetPassword(dto: RecruiterResetPasswordDto): Promise<RecruiterResetPasswordResponseDto>;
	login(res: Response, loginDto: RecruiterLoginDto): Promise<RecruiterLoginResponseDto>;
	signup(signupDto: RecruiterSignupDto): Promise<RecruiterSignResponseDto>;
	refresh(req: Request, res: Response): Promise<void>;
	verifyOtp(res: Response, otpDto: VerifyOTPDto): Promise<VerifyResponseOTPDto>;
}
