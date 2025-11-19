import {
	IsString,
	IsStrongPassword,
	MinLength,
	Matches,
} from "class-validator";

export class ChangePasswordDto {
	@IsString()
	@MinLength(6, { message: "Current password must be at least 6 characters" })
	currentPassword!: string;

	@IsStrongPassword(
		{
			minLength: 8,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 1,
		},
		{
			message:
				"New password must contain at least 8 characters including 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
		},
	)
	newPassword!: string;

	@IsString()
	@Matches(/^.*$/, {
		message: "Confirm password must match new password",
	})
	confirmNewPassword!: string;
}
