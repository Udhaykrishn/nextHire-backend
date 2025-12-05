import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_MAPPER, RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RECRUITER_STATUS } from "@/domain/enums/status/recruiter-status.enum";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class BlockUnblockRecruiterUseCase implements IExecutable<string, ResponseRecruiterDto> {
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

		recruiter.changeStatus(
			recruiter.status === RECRUITER_STATUS.ACTIVE ? RECRUITER_STATUS.BLOCKED : RECRUITER_STATUS.ACTIVE,
		);

		const updatedRecruiter = await this._recruiterRepository.findByIdAndUpdate(recruiterId, {
			status: recruiter.status,
		});

		if (!updatedRecruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_UPDATE_FAILED);
		}

		return this._recruiterMapper.toResponse(updatedRecruiter);
	}
}
