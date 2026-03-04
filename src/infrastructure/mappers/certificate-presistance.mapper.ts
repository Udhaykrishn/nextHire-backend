import { CertificateEntity } from "@/domain/entity/certificate.entity";
import type { ICertificatePresistanceMapper } from "@/application/interface/mappers/certificate/certificate-presistance.mapper";
import type { CertificateType } from "../db/mongodb/models/certificate.schema";

export class CertificatePresistanceMapper implements ICertificatePresistanceMapper<CertificateEntity, CertificateType> {
	toMongo(entity: CertificateEntity): CertificateType {
		return {
			_id: entity.id as string,
			userId: entity.userId,
			certificateName: entity.certificateName,
			issuingOrganization: entity.issuingOrganization,
			issueDate: entity.issueDate,
			expirationDate: entity.expirationDate,
			certificateUrl: entity.certificateUrl,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	async fromMongo(doc: CertificateType): Promise<CertificateEntity> {
		return CertificateEntity.create({
			id: doc._id.toString(),
			userId: doc.userId,
			certificateName: doc.certificateName,
			issuingOrganization: doc.issuingOrganization,
			issueDate: doc.issueDate,
			expirationDate: doc.expirationDate,
			certificateUrl: doc.certificateUrl,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}
