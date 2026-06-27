import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RECRUITER_STATUS } from "@/domain/enums/status/recruiter-status.enum";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { ADMIN_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class BlockUnblockRecruiterUseCase implements IExecutable<string, ResponseRecruiterDto> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		private readonly eventEmitter: EventEmitter2,
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

		this.eventEmitter.emit(ADMIN_EVENTS.RECRUITER_BLOCKED_UNBLOCKED, {
			recruiterId: updatedRecruiter.id,
			status: updatedRecruiter.status,
			companyName: updatedRecruiter.name,
		});

		return this._recruiterMapper.toResponse(updatedRecruiter);
	}
}
