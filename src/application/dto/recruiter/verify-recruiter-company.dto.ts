import { IsNotEmpty, IsString } from "class-validator";

export class VerifyRecruiterCompanyDto {
	@IsString()
	@IsNotEmpty()
	recruiterId: string;

	@IsString()
	@IsNotEmpty()
	GSTIN: string;

	@IsString()
	@IsNotEmpty()
	CIN: string;
}
