import { BadRequestException, ForbiddenException, Inject, Injectable } from "@nestjs/common";
import type { IUserRepository } from "@/application/interface/repository";
import { USER_MAPPER, USERS_TOKEN } from "@/application/enums/tokens";
import { UserEntity } from "@/domain/entity";
import { USER_MESSAGES, USER_STATUS } from "@/domain/enums";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import { ResponseUserDto } from "@/application/dto/users";

@Injectable()
export class CheckUserBlockedUseCase implements IExecutable<string, ResponseUserDto> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly userRepo: IUserRepository<UserEntity>,
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly userMapper: IUserApplicationMappers<UserEntity>,
	) {}

	async execute(userId: string): Promise<ResponseUserDto> {
		const user = await this.userRepo.findById(userId);

		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (user.status === USER_STATUS.BLOCK) {
			throw new ForbiddenException(USER_MESSAGES.USER_BLOCKED_BY_ADMIN);
		}

		return this.userMapper.toResponse(user);
	}
}
