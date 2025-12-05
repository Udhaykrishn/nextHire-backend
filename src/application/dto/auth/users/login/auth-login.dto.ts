import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class GoogleAuthDto {
	@IsString()
	@IsNotEmpty({ message: "Google credential is required" })
	credential: string;
}

export class UserLoginDto {
	@IsEmail({}, { message: "Invalid email format" })
	@IsNotEmpty({ message: "Email is required" })
	email: string;

	@IsString()
	@IsNotEmpty({ message: "Password is required" })
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string;
}
