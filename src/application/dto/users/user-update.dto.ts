import {
	IsEmail,
	IsString,
	IsOptional,
	IsUrl,
	MinLength,
	MaxLength,
	ValidateNested,
	IsPhoneNumber,
	IsArray,
	IsNotEmpty,
	IsEnum,
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
	@IsString()
	@MaxLength(500)
	bio?: string;

	@IsOptional()
	@ValidateNested()
	@Type(() => SocialLinkDto)
	social_link?: SocialLinkDto;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	skills?: string[];

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LanguageDto)
	languages?: LanguageDto[];
}

export class LanguageDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsEnum(["Low", "Medium", "High"])
	proficiency: string;
}
