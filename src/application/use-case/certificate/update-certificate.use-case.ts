import type { UpdateCertificateDto } from "@/application/dto/certificate/update-certificate.dto";
import type { ResponseCertificateDto } from "@/application/dto/certificate/response-certificate.dto";
import { CERTIFICATE_TOKEN } from "@/application/enums/tokens/certificate-token.enum";
import { CERTIFICATE_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ICertificateRepository } from "@/application/interface/repository/certificate-repository.interface";
import type { ICertificateApplicationMapper } from "@/application/interface/mappers/certificate/certificate-application-mapper.interface";
import type { CertificateEntity } from "@/domain/entity/certificate.entity";
import type { CertificateType } from "@/infrastructure/db/mongodb/models/certificate.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UpdateCertificateUseCase implements IExecutable<UpdateCertificateDto, ResponseCertificateDto> {
	constructor(
		@Inject(CERTIFICATE_TOKEN.CERTIFICATE_REPOSITORY)
		private readonly _certificateRepository: ICertificateRepository<CertificateEntity>,
		@Inject(CERTIFICATE_MAPPER.CERTIFICATE_APPLICATION)
		private readonly _mapper: ICertificateApplicationMapper<CertificateType>,
	) {}

	async execute(data: UpdateCertificateDto): Promise<ResponseCertificateDto> {
		const certificate = await this._certificateRepository.findById(data.id);
		if (!certificate) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.CERTIFICATE_NOT_FOUND);
		}

		if (data.certificateName) certificate.changeCertificateName(data.certificateName);
		if (data.issuingOrganization) certificate.changeIssuingOrganization(data.issuingOrganization);
		if (data.issueDate) certificate.changeIssueDate(data.issueDate);
		if (data.expirationDate) certificate.changeExpirationDate(data.expirationDate);
		if (data.certificateUrl) certificate.changeCertificateUrl(data.certificateUrl);

		const updatedCertificate = await this._certificateRepository.findByIdAndUpdate(certificate.id!, certificate);

		return this._mapper.toResponse(updatedCertificate!);
	}
}
