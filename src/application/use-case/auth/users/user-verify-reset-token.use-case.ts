import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { USERS_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { USER_MESSAGES } from "@/domain/enums/messages";
import { REDIS_KEYS } from "@/domain/enums/keys";
import type { AuthPayload } from "@/domain/types";

@Injectable()
export class UserVerifyResetTokenUseCase implements IExecutable<string, boolean> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {}

	async execute(token: string): Promise<boolean> {
		const storedToken = await this._redisService.get(`${REDIS_KEYS.RESET_TOKEN}${token}`);
		if (!storedToken) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN);
		}

		let payload: AuthPayload;
		try {
			payload = this._jwtService.verifyToken(token) as AuthPayload;
		} catch (_e) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN);
		}

		if (!payload.email) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN_PAYLOAD);
		}

		const user = await this._userRepository.findOne({ email: payload.email });
		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		return true;
	}
}
