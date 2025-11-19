import {
	IsOptional,
	IsString,
	IsNumber,
	MaxLength,
	MinLength,
	IsPositive,
} from "class-validator";
import { Type } from "class-transformer";

export class PaginationDto {
	@IsOptional()
	@IsString()
	@MinLength(1, { message: "Search must be at least 1 character" })
	@MaxLength(100, { message: "Search cannot exceed 100 characters" })
	search?: string;

	@Type(() => Number)
	@IsNumber({}, { message: "Page must be a number" })
	@IsPositive({ message: "Page must be a positive number" })
	page: number;

	@Type(() => Number)
	@IsNumber({}, { message: "Limit must be a number" })
	@IsPositive({ message: "Limit must be a positive number" })
	limit: number;
}
