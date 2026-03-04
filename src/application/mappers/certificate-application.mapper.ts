import { CertificateEntity } from "@/domain/entity/certificate.entity";
import type { ResponseCertificateDto } from "@/application/dto/certificate/response-certificate.dto";
import type { ICertificateApplicationMapper } from "@/application/interface/mappers/certificate/certificate-application-mapper.interface";
import type { CertificateType } from "@/infrastructure/db/mongodb/models/certificate.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CertificateApplicationMapper implements ICertificateApplicationMapper<CertificateType> {
	toResponse(certificate: CertificateEntity): ResponseCertificateDto {
		return {
			id: certificate.id as string,
			userId: certificate.userId,
			certificateName: certificate.certificateName,
			issuingOrganization: certificate.issuingOrganization,
			issueDate: certificate.issueDate,
			expirationDate: certificate.expirationDate,
			certificateUrl: certificate.certificateUrl,
			createdAt: certificate.createdAt,
		};
	}

	toDomain(data: CertificateType): CertificateEntity {
		return CertificateEntity.create({
			id: data._id?.toString(),
			userId: data.userId,
			certificateName: data.certificateName,
			issuingOrganization: data.issuingOrganization,
			issueDate: data.issueDate,
			expirationDate: data.expirationDate,
			certificateUrl: data.certificateUrl,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}
}
