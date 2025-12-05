import {
	IsEmail,
	IsString,
	IsOptional,
	IsUrl,
	MinLength,
	MaxLength,
	IsPhoneNumber,
} from "class-validator";

export class UpdateRecruiterDto {
	@IsOptional()
	@IsEmail({}, { message: "Invalid email format" })
	@MinLength(5)
	@MaxLength(80)
	email?: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name?: string;

	@IsOptional()
	@IsPhoneNumber("IN")
	phone?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	GSTIN?: string;

	@IsOptional()
	@IsUrl({}, { message: "Website link must be a valid URL" })
	website_link?: string;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	category?: string;

	@IsOptional()
	@IsString()
	@MaxLength(50)
	company_role?: string;
}
