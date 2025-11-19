import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import {
	COMMON_TOKEN,
	USER_MAPPER,
	USERS_TOKEN,
} from "@/application/enums/tokens";
import type {
	IJwtService,
	IRedisService,
} from "@/infrastructure/services/interface";
import { USER_MESSAGES, USER_ROLE, USER_STATUS } from "@/domain/enums";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { v4 as uuid } from "uuid";
import { REDIS_KEYS } from "@/domain/enums/keys";
import {
	VerifyOTPDto,
	VerifyResponseOTPDto,
} from "@/application/dto/auth/users/otp";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import { UserType } from "@/infrastructure/db/mongodb/models/user.schema";

@Injectable()
export class VerifyUserOtpUsecase
	implements IExecutable<VerifyOTPDto, VerifyResponseOTPDto>
{
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserType>,
	) {}

	async execute(dto: VerifyOTPDto): Promise<VerifyResponseOTPDto> {
		const user = await this._redisService.get(
			REDIS_KEYS.VERIFY_OTP.concat(dto.email),
		);

		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		const userData = this._userMapper.toDomain(JSON.parse(user));

		const otp = await this._redisService.get(
			REDIS_KEYS.OTP.concat(userData.email),
		);

		if (!otp) {
			throw new BadRequestException("Otp not found");
		}

		if (otp !== dto.otp) {
			throw new BadRequestException("Invalid otp");
		}

		userData.changeStatus(USER_STATUS.ACTIVE);

		const createUser = await this._userRepository.save(userData);

		const payload = {
			role: USER_ROLE.USER,
			email: createUser.email,
			id: createUser.id as string,
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

		this._redisService.set(REDIS_KEYS.REFRESH.concat(sessionId), refreshToken);

		this._redisService.del(REDIS_KEYS.OTP.concat(userData.email));
		this._redisService.del(REDIS_KEYS.VERIFY_OTP.concat(userData.email));

		return {
			accessToken,
			sessionId,
		};
	}
}
