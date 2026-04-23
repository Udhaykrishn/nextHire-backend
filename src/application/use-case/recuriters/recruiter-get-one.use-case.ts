import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetOneRecruiterUseCase implements IExecutable<string, ResponseRecruiterDto> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
	) {}

	async execute(recruiterId: string): Promise<ResponseRecruiterDto> {
		const recruiter = await this._recruiterRepository.findById(recruiterId);

		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		return this._recruiterMapper.toResponse(recruiter);
	}
}
