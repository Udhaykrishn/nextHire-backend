import type { ResponseCertificateDto } from "@/application/dto/certificate/response-certificate.dto";
import { CERTIFICATE_TOKEN } from "@/application/enums/tokens/certificate-token.enum";
import { CERTIFICATE_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ICertificateRepository } from "@/application/interface/repository/certificate-repository.interface";
import type { ICertificateApplicationMapper } from "@/application/interface/mappers/certificate/certificate-application-mapper.interface";
import type { CertificateEntity } from "@/domain/entity/certificate.entity";
import type { CertificateType } from "@/infrastructure/db/mongodb/models/certificate.schema";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetCertificatesUseCase implements IExecutable<string, ResponseCertificateDto[]> {
	constructor(
		@Inject(CERTIFICATE_TOKEN.CERTIFICATE_REPOSITORY)
		private readonly _certificateRepository: ICertificateRepository<CertificateEntity>,
		@Inject(CERTIFICATE_MAPPER.CERTIFICATE_APPLICATION)
		private readonly _mapper: ICertificateApplicationMapper<CertificateType>,
	) {}

	async execute(userId: string): Promise<ResponseCertificateDto[]> {
		const certificates = await this._certificateRepository.findByUserId(userId);
		if (!certificates || certificates.length === 0) return [];
		return certificates.map((cert) => this._mapper.toResponse(cert));
	}
}
