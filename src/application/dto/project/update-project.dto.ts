import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateProjectDto {
	@IsString()
	id: string;

	@IsOptional()
	@IsString()
	projectName?: string;

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
}
