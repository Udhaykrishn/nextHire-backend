import { IsString, Length, Matches } from "class-validator";

export class StartVerificationSessionDto {
	@IsString()
	@Length(21, 21, { message: "CIN must be exactly 21 characters long" })
	@Matches(/^[L|U][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, {
		message: "CIN must follow the standard 21-character format (e.g. L01234MH2024PLC123456)",
	})
	CIN: string;
}

export class VerifyOtpDto {
	@IsString()
	@Length(6, 6, { message: "OTP must be a 6-digit code" })
	otp: string;
}
