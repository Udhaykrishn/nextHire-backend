import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class FormFieldOptionDto {
	@IsString()
	label: string;

	@IsString()
	value: string;
}

export class FormFieldDto {
	@IsString()
	key: string;

	@IsString()
	label: string;

	@IsIn(["text", "email", "tel", "url", "password", "textarea", "select", "number", "date"])
	type: "text" | "email" | "tel" | "url" | "password" | "textarea" | "select" | "number" | "date";

	@IsOptional()
	@IsString()
	placeholder?: string;

	@IsBoolean()
	required: boolean;

	@IsBoolean()
	enabled: boolean;

	@IsBoolean()
	locked: boolean;

	@IsBoolean()
	custom: boolean;

	@IsInt()
	order: number;

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FormFieldOptionDto)
	options?: FormFieldOptionDto[];

	@IsOptional()
	@IsInt()
	@Min(0)
	minLength?: number;

	@IsOptional()
	@IsString()
	pattern?: string;

	@IsOptional()
	@IsString()
	errorMessage?: string;
}

export class UpdateFormDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FormFieldDto)
	fields: FormFieldDto[];
}
