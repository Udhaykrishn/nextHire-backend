import {
	Injectable,
	Inject,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type {
	IJwtService,
	IRedisService,
} from "@/infrastructure/services/interface";
import { USER_MESSAGES } from "@/domain/enums";
import { REDIS_KEYS } from "@/domain/enums/keys";

@Injectable()
export class UserLogoutUseCase implements IExecutable<string, boolean> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
	) {}

	async execute(sessionId: string): Promise<boolean> {
		const refreshToken = await this._redisService.get(
			REDIS_KEYS.REFRESH.concat(sessionId),
		);

		if (!refreshToken) {
			throw new UnauthorizedException("Token missing ");
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

		this._redisService.del(REDIS_KEYS.REFRESH.concat(sessionId));

		return true;
	}
}
