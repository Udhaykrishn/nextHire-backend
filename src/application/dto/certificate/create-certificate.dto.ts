import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateCertificateDto {
	@IsNotEmpty()
	@IsString()
	certificateName: string;

	@IsOptional()
	@IsString()
	issuingOrganization?: string;

	@IsOptional()
	@IsDateString()
	issueDate?: Date;

	@IsOptional()
	@IsDateString()
	expirationDate?: Date;

	@IsOptional()
	@IsUrl()
	certificateUrl?: string;

	@IsString()
	@IsNotEmpty()
	userId: string;
}
