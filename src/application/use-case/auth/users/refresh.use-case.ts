import {
	Injectable,
	Inject,
	UnauthorizedException,
	BadRequestException,
} from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type {
	IJwtService,
	IRedisService,
} from "@/infrastructure/services/interface";
import { UserRefreshTokenDto } from "@/application/dto/auth/users/refresh-token-res.dto";
import { USER_MESSAGES } from "@/domain/enums";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";

@Injectable()
export class UserRefreshUseCase
	implements IExecutable<string, UserRefreshTokenDto>
{
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {}

	async execute(sessionId: string): Promise<UserRefreshTokenDto> {
		const refreshToken = await this._redisService.get(
			`${REDIS_KEYS.REFRESH.concat(sessionId)}`,
		);

		if (!refreshToken) {
			throw new UnauthorizedException("Token expired or Invalid Token found");
		}

		const payload = this._jwtService.verifyToken<{
			id: string;
			email: string;
			role: string;
		}>(refreshToken);

		const user = await this._userRepository.findById(payload.id);

		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		const accessToken = await this._jwtService.generateToken(
			payload,
			COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR,
		);

		return { accessToken };
	}
}
