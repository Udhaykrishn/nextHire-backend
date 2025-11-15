import type { CreateUserDto } from "@/application/dto/users/user-create.dto";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import { USER_MAPPER } from "@/application/enums/tokens/user-mapper.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import type { IUserRepository } from "@/application/interface/repository";
import type {
	IPasswordHash,
	IEmailService,
} from "@/infrastructure/services/interface";
import { UserEntity } from "@/domain/entity/user.entity";
import { USER_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
@Injectable()
export class CreateUserUseCase
	implements IExecutable<CreateUserDto, ResponseUserDto>
{
	constructor(
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers,
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHasher: IPasswordHash,
		@Inject(COMMON_TOKEN.EMAIL_SERVICE)
		private readonly _emailService: IEmailService,
	) {}
	async execute(userDto: CreateUserDto): Promise<ResponseUserDto> {
		const isValidEmail = await this._emailService.validate(userDto.email);

		if (!isValidEmail) {
			throw new NotFoundException("Invalid email address");
		}

		const checkUserExsitOrNot = await this._userRepository.findByUniqueFields({
			email: userDto.email,
			phone: userDto.phone,
		});

		if (checkUserExsitOrNot) {
			throw new NotFoundException(USER_MESSAGES.USER_ALREADY_EXSITS);
		}

		const hashedPassword = await this._passwordHasher.hash(userDto.password);

		const user = UserEntity.create({
			email: userDto.email,
			name: userDto.name,
			password: hashedPassword,
			phone: userDto.phone,
		});

		const saveduser = await this._userRepository.save(user);
		return this._userMapper.toResponse(saveduser);
	}
}
