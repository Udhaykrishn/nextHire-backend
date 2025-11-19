import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import { USER_STATUS } from "@/domain/enums/status/user-status.enum";
import { UserType } from "@/infrastructure/db/mongodb/models/user.schema";
import { NotFoundException } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class BlockUnblockUserUseCase
	implements IExecutable<string, ResponseUserDto>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserType>,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
	) {}

	async execute(userId: string): Promise<ResponseUserDto> {
		const user = await this._userRepository.findById(userId);

		if (!user) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		user.changeStatus(
			user.status === USER_STATUS.ACTIVE
				? USER_STATUS.BLOCK
				: USER_STATUS.ACTIVE,
		);

		const updateUser = await this._userRepository.findByIdAndUpdate(userId, {
			status: user.status,
		});

		if (!updateUser) {
			throw new NotFoundException("Error uding update");
		}
		return this._userMapper.toResponse(updateUser);
	}
}
