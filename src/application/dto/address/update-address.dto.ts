import { IsOptional, IsString } from "class-validator";

export class UpdateAddressDto {
	@IsString()
	id: string;

	@IsOptional()
	@IsString()
	line1?: string;

	@IsOptional()
	@IsString()
	line2?: string;

	@IsOptional()
	@IsString()
	city?: string;

	@IsOptional()
	@IsString()
	district?: string;

	@IsOptional()
	@IsString()
	state?: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@IsString()
	pincode?: string;
}
