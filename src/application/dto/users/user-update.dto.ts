import {
	IsEmail,
	IsString,
	IsOptional,
	IsUrl,
	MinLength,
	MaxLength,
	ValidateNested,
	IsPhoneNumber,
} from "class-validator";
import { Type } from "class-transformer";

class SocialLinkDto {
	@IsUrl()
	linkedin: string;

	@IsUrl()
	portfolio: string;

	@IsUrl()
	github: string;
}

export class UpdateUserDto {
	@IsEmail({}, { message: "Invalid email format" })
	@MinLength(5)
	@MaxLength(80)
	@IsOptional()
	email: string;

	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(50)
	name: string;

	@IsOptional()
	@IsString()
	@IsPhoneNumber("IN")
	phone: string;

	@IsOptional()
	@IsString()
	@MaxLength(300)
	experience?: string;

	@IsOptional()
	@IsString()
	@MaxLength(100)
	role_of_title?: string;

	@IsOptional()
	@IsUrl({}, { message: "resume_url must be a valid URL" })
	resume_url?: string;

	@IsOptional()
	@IsString()
	@MaxLength(500)
	bio?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => SocialLinkDto)
	social_link?: SocialLinkDto;
}
