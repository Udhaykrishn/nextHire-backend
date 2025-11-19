import {
	IsEmail,
	IsStrongPassword,
	IsString,
	IsNotEmpty,
	IsAlpha,
	IsPhoneNumber,
} from "class-validator";

export class UserSignupDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({
		minLength: 6,
		minNumbers: 1,
		minSymbols: 1,
		minUppercase: 1,
	})
	password: string;

	@IsString()
	@IsPhoneNumber("IN")
	@IsNotEmpty()
	phone: string;

	@IsAlpha()
	name: string;
}
