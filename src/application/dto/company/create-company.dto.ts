import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCompanyDto {
	@IsNotEmpty()
	@IsString()
	name: string;

	@IsOptional()
	@IsUrl()
	logo_url?: string;

	@IsOptional()
	@IsString()
	website?: string;

	@IsOptional()
	@IsString()
	industry?: string;

	@IsOptional()
	@IsString()
	company_size?: string;

	@IsOptional()
	@IsString()
	location?: string;

	@IsOptional()
	@IsString()
	about?: string;
}
