import { RECRUITER_MAPPER } from "@/application/enums/recruiter/recruiter-mapper.enum";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import type { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import type { IExecutable } from "@/application/interface/executable.interface";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import type { ResponseRecruiterDto } from "@/application/dto/recruiter";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";

@Injectable()
export class RecruiterFindByEmailUseCase implements IExecutable<string, ResponseRecruiterDto> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(email: string): Promise<ResponseRecruiterDto> {
		const recruiter = await this._recruiterRepository.findOne({ email });

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}
		return this._recruiterMapper.toResponse(recruiter);
	}
}
