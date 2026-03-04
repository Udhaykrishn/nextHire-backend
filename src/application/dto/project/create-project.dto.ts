import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateProjectDto {
	@IsNotEmpty()
	@IsString()
	projectName: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsDateString()
	startDate?: Date;

	@IsOptional()
	@IsDateString()
	endDate?: Date;

	@IsOptional()
	@IsUrl()
	url?: string;

	@IsString()
	@IsNotEmpty()
	userId: string;
}
