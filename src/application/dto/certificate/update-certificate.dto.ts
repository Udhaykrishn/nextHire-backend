import { IsDate, IsOptional, IsString, IsUrl } from "class-validator";
import { Type } from "class-transformer";

export class UpdateCertificateDto {
	@IsString()
	@IsOptional()
	id?: string;

	@IsOptional()
	@IsString()
	certificateName?: string;

	@IsOptional()
	@IsString()
	issuingOrganization?: string;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	issueDate?: Date;

	@IsOptional()
	@IsDate()
	@Type(() => Date)
	expirationDate?: Date;

	@IsOptional()
	@IsUrl()
	certificateUrl?: string;
}
