import type { CreateCertificateDto } from "@/application/dto/certificate/create-certificate.dto";
import type { ResponseCertificateDto } from "@/application/dto/certificate/response-certificate.dto";
import { CERTIFICATE_TOKEN } from "@/application/enums/tokens/certificate-token.enum";
import { CERTIFICATE_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ICertificateRepository } from "@/application/interface/repository/certificate-repository.interface";
import type { ICertificateApplicationMapper } from "@/application/interface/mappers/certificate/certificate-application-mapper.interface";
import { CertificateEntity } from "@/domain/entity/certificate.entity";
import { CertificateType } from "@/infrastructure/db/mongodb/models/certificate.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { PLAN_LIMITS } from "@/domain/constants";

@Injectable()
export class CreateCertificateUseCase implements IExecutable<CreateCertificateDto, ResponseCertificateDto> {
	constructor(
		@Inject(CERTIFICATE_TOKEN.CERTIFICATE_REPOSITORY)
		private readonly _certificateRepository: ICertificateRepository<CertificateEntity>,
		@Inject(CERTIFICATE_MAPPER.CERTIFICATE_APPLICATION)
		private readonly _mapper: ICertificateApplicationMapper<CertificateType>,
	) {}

	async execute(data: CreateCertificateDto): Promise<ResponseCertificateDto> {
		const currentCertificates = await this._certificateRepository.findByUserId(data.userId);
		if (currentCertificates.length >= PLAN_LIMITS.FREE.MAX_CERTIFICATES) {
			throw new BadRequestException(USER_PROFILE_MESSAGES.CERTIFICATE_LIMIT_REACHED);
		}

		const certificate = CertificateEntity.create({
			userId: data.userId,
			certificateName: data.certificateName,
			issuingOrganization: data.issuingOrganization,
			issueDate: data.issueDate,
			expirationDate: data.expirationDate,
			certificateUrl: data.certificateUrl,
		});

		const savedCertificate = await this._certificateRepository.save(certificate);

		return this._mapper.toResponse(savedCertificate);
	}
}
