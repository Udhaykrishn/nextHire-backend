import {
	IsEmail,
	IsStrongPassword,
	IsString,
	IsNotEmpty,
	IsAlpha,
	IsNumber,
	IsPhoneNumber,
} from "class-validator";

export class CreateUserDto {
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

	@IsNumber()
	@IsPhoneNumber("IN")
	@IsNotEmpty()
	phone: string;

	@IsAlpha()
	name: string;
}
