import { RecruiterLoginDto, RecruiterLoginResponseDto } from "@/application/dto/auth/recruiter/login";
import { RecruiterSignResponseDto, RecruiterSignupDto } from "@/application/dto/auth/recruiter/signup";
import { RecruiterForgotPasswordDto, RecruiterResetPasswordDto } from "@/application/dto/auth/recruiter";
import { VerifyOTPDto, VerifyResponseOTPDto } from "@/application/dto/auth/otp";
import { Request, Response } from "express";

export interface IAuthRecruiterController {
	forgotPassword(dto: RecruiterForgotPasswordDto): Promise<any>;
	resetPassword(dto: RecruiterResetPasswordDto): Promise<any>;
	login(res: Response, loginDto: RecruiterLoginDto): Promise<RecruiterLoginResponseDto>;
	signup(signupDto: RecruiterSignupDto): Promise<RecruiterSignResponseDto>;
	refresh(req: Request, res: Response): Promise<void>;
	verifyOtp(res: Response, otpDto: VerifyOTPDto): Promise<VerifyResponseOTPDto>;
}
