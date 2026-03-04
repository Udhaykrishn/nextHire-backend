import { IsDateString, IsOptional, IsString, IsUrl } from "class-validator";

export class UpdateCertificateDto {
	@IsString()
	id: string;

	@IsOptional()
	@IsString()
	certificateName?: string;

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
}
