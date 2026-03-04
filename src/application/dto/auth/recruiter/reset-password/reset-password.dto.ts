import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class RecruiterResetPasswordDto {
	@IsString()
	@IsNotEmpty()
	token: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	password: string;

	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	confirmPassword: string;
}
