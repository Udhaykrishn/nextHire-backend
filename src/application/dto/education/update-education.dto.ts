import { IsDateString, IsOptional, IsString } from "class-validator";

export class UpdateEducationDto {
	@IsString()
	id: string;

	@IsOptional()
	@IsString()
	institutionName?: string;

	@IsOptional()
	@IsString()
	degree?: string;

	@IsOptional()
	@IsString()
	fieldOfStudy?: string;

	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@IsDateString()
	endDate?: Date;

	@IsOptional()
	@IsString()
	gpa?: string;
}
