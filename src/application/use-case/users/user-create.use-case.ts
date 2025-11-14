import type { CreateUserDto } from "@/application/dto/users/user-create.dto";
import type { CreateResponseUserDto } from "@/application/dto/users/user-response.dto";
import { USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import { AlreadyExistsException } from "@/domain/exceptions/already-exists.exception";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateUserUseCase
	implements IExecutable<CreateUserDto, CreateResponseUserDto>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
	) {}
	async execute(userDto: CreateUserDto): Promise<CreateResponseUserDto> {
		const checkUserExsitOrNot = await this._userRepository.findByUniqueFields({
			email: userDto.email,
			phone: userDto.phone,
		});

		if (checkUserExsitOrNot) {
			throw new AlreadyExistsException(USER_MESSAGES.USER_ALREADY_EXSITS);
		}

		const user = await UserEntity.create({
			email: userDto.email,
			name: userDto.name,
			password: userDto.password,
			phone: userDto.phone,
		});

		const saveduser = await this._userRepository.save(user);
		return this._userMapper.toResponse(saveduser);
	}
}
