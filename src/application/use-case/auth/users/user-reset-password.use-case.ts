import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { ResetPasswordDto, ResetPasswordResponseDto } from "@/application/dto/auth/users";
import { USERS_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import type { IJwtService, IPasswordHash, IRedisService } from "@/infrastructure/services/interface";
import { PASSWORD_MESSAGES, USER_MESSAGES } from "@/domain/enums/messages";
import { REDIS_KEYS } from "@/domain/enums/keys";
import type { AuthPayload } from "@/domain/types";

@Injectable()
export class UserResetPasswordUseCase implements IExecutable<ResetPasswordDto, ResetPasswordResponseDto> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {}

	async execute(dto: ResetPasswordDto): Promise<ResetPasswordResponseDto> {
		const storedToken = await this._redisService.get(`${REDIS_KEYS.RESET_TOKEN}${dto.token}`);
		if (!storedToken) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN);
		}

		let payload: AuthPayload;
		try {
			payload = this._jwtService.verifyToken(dto.token) as AuthPayload;
		} catch (e) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN);
		}

		if (!payload.email) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN_PAYLOAD);
		}

		const user = await this._userRepository.findOne({ email: payload.email });
		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		const hashedPassword = await this._passwordHash.hash(dto.password);

		await this._userRepository.findByIdAndUpdate(user.id as string, { password: hashedPassword });
		await this._redisService.del(`${REDIS_KEYS.RESET_TOKEN}${dto.token}`);

		return {
			success: true,
			message: PASSWORD_MESSAGES.PASSWORD_RESET_SUCCESSFULLY,
		};
	}
}
