import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateInterviewerDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	department: string;

	@IsString()
	@IsOptional()
	password?: string;

	companyId?: string;
	createdBy?: string;
}
