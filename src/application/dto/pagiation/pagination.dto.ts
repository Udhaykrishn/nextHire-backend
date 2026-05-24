import { IsOptional, IsString, IsNumber, MaxLength, MinLength, IsPositive, IsBoolean, IsArray } from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
	@IsOptional()
	@IsString()
	@MinLength(1, { message: "Search must be at least 1 character" })
	@MaxLength(100, { message: "Search cannot exceed 100 characters" })
	search?: string;

	@IsOptional()
	@IsString()
	status?: string;

	@IsOptional()
	@IsBoolean()
	is_published?: boolean;

	@IsOptional()
	@IsString()
	location?: string;

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	experience?: string[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	salary?: string[];

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	jobTypes?: string[];

	@Type(() => Number)
	@IsOptional()
	@IsNumber({}, { message: "Page must be a number" })
	@IsPositive({ message: "Page must be a positive number" })
	page: number;

	@Type(() => Number)
	@IsOptional()
	@IsNumber({}, { message: "Limit must be a number" })
	@IsPositive({ message: "Limit must be a positive number" })
	limit: number;
}
