import type { ResponseCertificateDto } from "@/application/dto/certificate/response-certificate.dto";
import type { CertificateEntity } from "@/domain/entity/certificate.entity";

export interface ICertificateApplicationMapper<T> {
	toResponse(data: CertificateEntity): ResponseCertificateDto;
	toDomain(data: T): CertificateEntity;
}
