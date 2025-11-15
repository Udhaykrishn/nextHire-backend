import type { PaginationDto } from "@/application/dto/pagiation";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import type { PaginationResponse } from "@/domain/types/paginations";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class GetAllUsersUseCase
	implements IExecutable<PaginationDto, PaginationResponse<ResponseUserDto>>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _mapper: IUserApplicationMappers,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
	) {}

	async execute(
		paginationDto: PaginationDto,
	): Promise<PaginationResponse<ResponseUserDto>> {
		const users = await this._userRepository.findAllUsers(paginationDto);

		if (!users) {
			throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND);
		}

		const mappedUser = users.data.map((user) => this._mapper.toResponse(user));

		return {
			data: mappedUser,
			page: users.page,
			total: users.total,
		};
	}
}
