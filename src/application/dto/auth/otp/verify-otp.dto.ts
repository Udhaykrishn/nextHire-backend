import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class VerifyOTPDto {
	@IsString({ message: "Otp required " })
	@IsNotEmpty()
	otp: string;

	@IsEmail()
	email: string;
}
