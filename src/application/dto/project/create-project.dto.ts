import {
	IsDate,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUrl,
	IsBoolean,
	IsArray,
	ArrayMaxSize,
	ValidateNested,
	MaxLength,
	ValidateIf,
	registerDecorator,
	ValidationOptions,
	ValidationArguments,
} from "class-validator";
import { Type } from "class-transformer";

function IsPastOrToday(validationOptions?: ValidationOptions) {
	return (object: Object, propertyName: string) => {
		registerDecorator({
			name: "isPastOrToday",
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			validator: {
				validate(value: unknown) {
					return value instanceof Date && value.getTime() <= Date.now();
				},
				defaultMessage(args: ValidationArguments) {
					return `${args.property} cannot be a future date`;
				},
			},
		});
	};
}

class GithubUrlDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsUrl()
	url: string;
}

export class CreateProjectDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(100)
	projectName: string;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	description?: string;

	@IsOptional()
	@IsDate()
	@IsPastOrToday()
	@Type(() => Date)
	startDate?: Date;

	@IsOptional()
	@IsDate()
	@IsPastOrToday()
	@Type(() => Date)
	endDate?: Date;

	@IsOptional()
	@ValidateIf((o) => o.url !== "" && o.url !== undefined && o.url !== null)
	@IsUrl()
	url?: string;

	@IsOptional()
	@IsArray()
	@ArrayMaxSize(5)
	@ValidateNested({ each: true })
	@Type(() => GithubUrlDto)
	githubUrls?: GithubUrlDto[];

	@IsOptional()
	@IsBoolean()
	isCollaborative?: boolean;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	skillsLearned?: string[];

	@IsString()
	@IsOptional()
	userId?: string;

	@IsOptional()
	@IsString()
	company?: string;

	@IsOptional()
	@IsString()
	location?: string;

	@IsOptional()
	@IsString()
	industry?: string;

	@IsOptional()
	@IsString()
	role?: string;

	@IsOptional()
	@IsBoolean()
	currentlyWorking?: boolean;

	@IsOptional()
	@IsString()
	employmentType?: string;

	@IsOptional()
	@IsString()
	noticePeriod?: string;
}
