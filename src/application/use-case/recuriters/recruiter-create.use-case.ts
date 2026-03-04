import { CreateRecruiterDto, ResponseRecruiterDto } from "@/application/dto/recruiter";
import { RECRUITER_MAPPER } from "@/application/enums";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { AlreadyExistsException } from "@/domain/exceptions/already-exists.exception";
import type { IPasswordHash } from "@/infrastructure/services/interface";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateRecruiterUseCase implements IExecutable<CreateRecruiterDto, ResponseRecruiterDto> {
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHasher: IPasswordHash,
	) { }

	async execute(recruiterDto: CreateRecruiterDto): Promise<ResponseRecruiterDto> {
		const existingRecruiter = await this._recruiterRepository.findByUniqueFields({
			email: recruiterDto.email,
			phone: recruiterDto.phone,
		});

		if (existingRecruiter) {
			throw new AlreadyExistsException(RECRUITER_MESSAGES.RECRUITER_ALREADY_EXISTS);
		}

		const hashedPassword = await this._passwordHasher.hash(recruiterDto.password);

		const recruiter = RecruiterEntity.create({
			email: recruiterDto.email,
			name: recruiterDto.name,
			password: hashedPassword,
			phone: recruiterDto.phone,
		});

		const savedRecruiter = await this._recruiterRepository.save(recruiter);

		return this._recruiterMapper.toResponse(savedRecruiter);
	}
}
