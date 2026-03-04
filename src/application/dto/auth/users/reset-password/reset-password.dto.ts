import {
	IsNotEmpty,
	IsString,
	MinLength,
	Validate,
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "MatchPassword", async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
	validate(confirmPassword: string, args: ValidationArguments) {
		const object = args.object as ResetPasswordDto;
		const password = object[args.constraints[0]];
		return confirmPassword === password;
	}
}

export class ResetPasswordDto {
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
	@Validate(MatchPasswordConstraint, ["password"])
	confirmPassword: string;
}
