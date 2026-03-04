import { CERTIFICATE_TOKEN } from "@/application/enums/tokens/certificate-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { ICertificateRepository } from "@/application/interface/repository/certificate-repository.interface";
import type { CertificateEntity } from "@/domain/entity/certificate.entity";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteCertificateUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(CERTIFICATE_TOKEN.CERTIFICATE_REPOSITORY)
		private readonly _certificateRepository: ICertificateRepository<CertificateEntity>,
	) {}

	async execute(id: string): Promise<void> {
		const success = await this._certificateRepository.deleteById(id);
		if (!success) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.CERTIFICATE_NOT_FOUND);
		}
	}
}
