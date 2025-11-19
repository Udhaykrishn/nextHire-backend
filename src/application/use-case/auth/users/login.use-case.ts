import { Injectable, Inject } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type {
	IJwtService,
	IRedisService,
} from "@/infrastructure/services/interface";
import type { UserLoginDto } from "@/application/dto/auth";
import { UserLoginResponseDto } from "@/application/dto/auth/users/login/auth-login-response.dto";
import { USER_ROLE } from "@/domain/enums";
import { v4 as uuid } from "uuid";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";

@Injectable()
export class UserLoginUseCase
	implements IExecutable<UserLoginDto, UserLoginResponseDto>
{
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {}

	async execute(dto: UserLoginDto): Promise<UserLoginResponseDto> {
		const auth = await this._userRepository.findOne({ email: dto.email });
		if (!auth) throw new Error("User not found");

		// const isMatch = await this._passwordHash.compare(
		// 	auth.password,
		// 	dto.password,
		// );

		// if (!isMatch) {
		// 	throw new BadRequestException("Invalid credintails");
		// }

		const payload = {
			id: auth.id as string,
			role: USER_ROLE.USER,
			email: auth.email,
		};

		const accessToken = await this._jwtService.generateToken(
			payload,
			COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR,
		);
		const refreshToken = await this._jwtService.generateToken(
			payload,
			COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY,
		);

		const sessionId = uuid();

		this._redisService.set(
			`${REDIS_KEYS.REFRESH.concat(sessionId)}`,
			refreshToken,
		);

		return { accessToken: accessToken, sessionId };
	}
}
