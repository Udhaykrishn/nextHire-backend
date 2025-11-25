import { ResponseRecruiterDto } from "@/application/dto/recruiter";
import { ChangePasswordDto } from "@/application/dto/users/change-password.dto";
import {
	RECRUITER_MAPPER,
	RECRUITER_TOKEN,
} from "@/application/enums/recruiter";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IRecruiterApplicationMappers } from "@/application/interface/mappers/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { PASSWORD_MESSAGES, RECRUITER_MESSAGES } from "@/domain/enums/messages";
import type { IPasswordHash } from "@/infrastructure/services/interface";
import {
	Inject,
	Injectable,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class RecruiterChangePasswordUseCase
	implements
		IExecutable<
			{ recruiterId: string; dto: ChangePasswordDto },
			ResponseRecruiterDto
		>
{
	constructor(
		@Inject(RECRUITER_MAPPER.RECRUITER_APPLICATION)
		private readonly _recruiterMapper: IRecruiterApplicationMappers<RecruiterEntity>,

		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHasher: IPasswordHash,
	) {}

	async execute(input: {
		recruiterId: string;
		dto: ChangePasswordDto;
	}): Promise<ResponseRecruiterDto> {
		const { recruiterId, dto } = input;

		if (dto.newPassword !== dto.confirmNewPassword) {
			throw new BadRequestException(PASSWORD_MESSAGES.PASSWORDS_DO_NOT_MATCH);
		}

		const recruiter = await this._recruiterRepository.findById(recruiterId);
		if (!recruiter) {
			throw new NotFoundException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		const isCurrentPasswordValid = await this._passwordHasher.compare(
			recruiter.password,
			dto.currentPassword,
		);

		if (!isCurrentPasswordValid) {
			throw new BadRequestException(PASSWORD_MESSAGES.INVALID_CURRENT_PASSWORD);
		}

		const isSameAsOld = await this._passwordHasher.compare(
			recruiter.password,
			dto.newPassword,
		);

		if (isSameAsOld) {
			throw new BadRequestException(PASSWORD_MESSAGES.NEW_PASSWORD_SAME_AS_OLD);
		}

		const hashedNewPassword = await this._passwordHasher.hash(dto.newPassword);
		recruiter.changePassword(hashedNewPassword);

		const updatedRecruiter = await this._recruiterRepository.findByIdAndUpdate(
			recruiter.id as string,
			recruiter,
		);

		if (!updatedRecruiter) {
			throw new BadRequestException(RECRUITER_MESSAGES.RECRUITER_UPDATE_FAILED);
		}

		return this._recruiterMapper.toResponse(updatedRecruiter);
	}
}
