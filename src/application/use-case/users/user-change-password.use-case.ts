import { ChangePasswordDto } from "@/application/dto/users/change-password.dto";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import type { IPasswordHash } from "@/infrastructure/services/interface/password-hash.interface";
import { USER_MESSAGES } from "@/domain/enums";
import { PASSWORD_MESSAGES } from "@/domain/enums/messages";
import {
	Inject,
	Injectable,
	BadRequestException,
	NotFoundException,
} from "@nestjs/common";

@Injectable()
export class UserChangePasswordUseCase
	implements
		IExecutable<{ userId: string; dto: ChangePasswordDto }, ResponseUserDto>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserEntity>,

		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,

		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHasher: IPasswordHash,
	) {}

	async execute(input: {
		userId: string;
		dto: ChangePasswordDto;
	}): Promise<ResponseUserDto> {
		const { userId, dto } = input;

		if (dto.newPassword !== dto.confirmNewPassword) {
			throw new BadRequestException(PASSWORD_MESSAGES.PASSWORDS_DO_NOT_MATCH);
		}

		const user = await this._userRepository.findById(userId);
		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		const isCurrentPasswordValid = await this._passwordHasher.compare(
			user.password,
			dto.currentPassword,
		);

		if (!isCurrentPasswordValid) {
			throw new BadRequestException(PASSWORD_MESSAGES.INVALID_CURRENT_PASSWORD);
		}

		const isSameAsOld = await this._passwordHasher.compare(
			user.password,
			dto.newPassword,
		);

		if (isSameAsOld) {
			throw new BadRequestException(PASSWORD_MESSAGES.NEW_PASSWORD_SAME_AS_OLD);
		}

		const hashedNewPassword = await this._passwordHasher.hash(dto.newPassword);
		user.changePassword(hashedNewPassword);

		const updatedUser = await this._userRepository.findByIdAndUpdate(
			user.id as string,
			user,
		);

		if (!updatedUser) {
			throw new BadRequestException(USER_MESSAGES.USER_UPDATE_FAILED);
		}

		return this._userMapper.toResponse(updatedUser);
	}
}
