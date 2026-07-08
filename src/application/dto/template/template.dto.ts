import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ArrayNotEmpty } from "class-validator";

export class CreateTemplateDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber()
	@Min(1)
	duration: number;

	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	rubric: string[];

	companyId?: string;
}

export class UpdateTemplateDto {
	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string;

	@IsNumber()
	@Min(1)
	@IsOptional()
	duration?: number;

	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	rubric?: string[];

	@IsString()
	@IsOptional()
	defaultType?: string;

	@IsString()
	@IsOptional()
	defaultInstructions?: string;

	templateId?: string;
	companyId?: string;
}
