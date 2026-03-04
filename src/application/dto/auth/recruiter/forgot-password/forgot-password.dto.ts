import { IsEmail, IsNotEmpty } from "class-validator";

export class RecruiterForgotPasswordDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;
}
