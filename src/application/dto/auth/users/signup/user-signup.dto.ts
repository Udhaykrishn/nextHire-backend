import {
	IsEmail,
	IsStrongPassword,
	IsString,
	IsNotEmpty,
	IsAlpha,
	IsPhoneNumber,
	ValidatorConstraint,
	ValidatorConstraintInterface,
	ValidationArguments,
	Validate,
} from "class-validator";

@ValidatorConstraint({ name: "MatchPassword", async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
	validate(confirmPassword: string, args: ValidationArguments) {
		const object = args.object as UserSignupDto;
		const password = object[args.constraints[0]];
		return confirmPassword === password;
	}
}

export class UserSignupDto {
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@IsStrongPassword({
		minLength: 6,
		minLowercase: 1,
		minUppercase: 1,
		minNumbers: 1,
		minSymbols: 1,
	})
	password: string;

	@IsNotEmpty()
	@IsString()
	@Validate(MatchPasswordConstraint, ["password"])
	confirmPassword: string;

	@IsNotEmpty()
	@IsString()
	@IsPhoneNumber("IN")
	phone: string;

	@IsNotEmpty()
	@IsString()
	@IsAlpha()
	name: string;
}
