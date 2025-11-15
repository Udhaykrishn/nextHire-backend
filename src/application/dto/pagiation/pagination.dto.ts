import {
	IsOptional,
	IsString,
	IsNumber,
	Min,
	Max,
	MaxLength,
	MinLength,
} from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
	@IsOptional()
	@IsString()
	@MinLength(1, { message: "Search must be at least 1 character" })
	@MaxLength(100, { message: "Search cannot exceed 100 characters" })
	search?: string;

	@Type(() => Number)
	@IsNumber()
	@Min(1, { message: "Page must be at least 1" })
	@Max(200, { message: "Page cannot exceed 200" })
	page: number;

	@Type(() => Number)
	@IsNumber()
	@Min(1, { message: "Limit must be at least 1" })
	@Max(100, { message: "Limit cannot exceed 100" })
	limit: number;
}
