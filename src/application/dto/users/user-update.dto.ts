import {
	IsEmail,
	IsString,
	IsOptional,
	MinLength,
	MaxLength,
	ValidateNested,
	IsPhoneNumber,
	IsArray,
	IsNotEmpty,
	IsEnum,
	Matches,
	ValidateIf,
} from "class-validator";
import { Type } from "class-transformer";

class SocialLinkDto {
	@IsOptional()
	@ValidateIf((o) => o.linkedin !== "" && o.linkedin !== undefined && o.linkedin !== null)
	@Matches(/^https:\/\/([a-zA-Z0-9-]+\.)?linkedin\.com\/.*$/, {
		message:
			"LinkedIn profile must be a valid HTTPS URL matching linkedin.com (e.g. https://www.linkedin.com/in/username)",
	})
	linkedin: string;

	@IsOptional()
	@ValidateIf((o) => o.portfolio !== "" && o.portfolio !== undefined && o.portfolio !== null)
	@Matches(/^https:\/\/(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,4}(\/\S*)?$/, {
		message: "Portfolio must be a valid HTTPS URL (e.g. https://myportfolio.com) and cannot be localhost",
	})
	portfolio: string;

	@IsOptional()
	@ValidateIf((o) => o.github !== "" && o.github !== undefined && o.github !== null)
	@Matches(/^https:\/\/(www\.)?github\.com\/.*$/, {
		message: "GitHub profile must be a valid HTTPS URL matching github.com",
	})
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
	role_of_title?: string;

	@IsOptional()
	@IsString()
	location?: string;

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
