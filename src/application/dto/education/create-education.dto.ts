import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@IsDateString()
	endDate?: Date;

	@IsOptional()
	@IsString()
	gpa?: string;

	@IsString()
	@IsNotEmpty()
	userId: string;
}
