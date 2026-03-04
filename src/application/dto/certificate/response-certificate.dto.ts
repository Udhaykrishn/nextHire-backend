import { Expose } from "class-transformer";

export class ResponseCertificateDto {
	@Expose()
	id: string;

	@Expose()
	userId: string;

	@Expose()
	certificateName: string;

	@Expose()
	issuingOrganization: string;

	@Expose()
	issueDate: Date;

	@Expose()
	expirationDate: Date;

	@Expose()
	certificateUrl: string;

	@Expose()
	createdAt: Date;
}
