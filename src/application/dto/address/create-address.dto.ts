import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateAddressDto {
	@IsNotEmpty()
	@IsString()
	line1: string;

	@IsOptional()
	@IsString()
	line2?: string;

	@IsNotEmpty()
	@IsString()
	city: string;

	@IsNotEmpty()
	@IsString()
	district: string;

	@IsNotEmpty()
	@IsString()
	state: string;

	@IsNotEmpty()
	@IsString()
	country: string;

	@IsNotEmpty()
	@IsString()
	pincode: string;

	@IsNotEmpty()
	@IsString()
	role: "user" | "company";

	@IsString()
	@IsNotEmpty()
	userId: string;
}
