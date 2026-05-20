import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CreateEducationDto {
	@IsNotEmpty()
	@IsString()
	institutionName: string;

	@IsOptional()
	@IsString()
	degree?: string;

	@IsOptional()
	@IsString()
	fieldOfStudy?: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	startDate?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	endDate?: Date;

	@IsOptional()
	@IsString()
	gpa?: string;

	@IsString()
	@IsOptional()
	userId?: string;
}
