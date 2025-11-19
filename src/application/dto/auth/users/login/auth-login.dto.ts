import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class UserLoginDto {
	@IsEmail({}, { message: "Invalid email address" })
	@IsNotEmpty({ message: "Email is required" })
	email: string;

	@IsStrongPassword(
		{
			minLength: 6,
			minSymbols: 1,
			minLowercase: 1,
			minNumbers: 1,
			minUppercase: 1,
		},
		{ message: "Password is not strong enough" },
	)
	password: string;
}
