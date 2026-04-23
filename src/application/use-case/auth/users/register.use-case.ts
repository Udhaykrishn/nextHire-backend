import { Injectable, Inject } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type { IOtpService, IPasswordHash, IRedisService } from "@/infrastructure/services/interface";
import { USER_MESSAGES } from "@/domain/enums";
import { UserSignupDto } from "@/application/dto/auth/users/signup/user-signup.dto";
import { UserSignResponseDto } from "@/application/dto/auth/users/signup/user-signup-res.dto";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user/user-application-mapper.interface";
import { UserType } from "@/infrastructure/db/mongodb/models/user.schema";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { USER_MAPPER } from "@/application/enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class UserRegisterUseCase implements IExecutable<UserSignupDto, UserSignResponseDto> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.OTP_SERVICE)
		private readonly _otpService: IOtpService,
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserType>,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async execute(dto: UserSignupDto): Promise<UserSignResponseDto> {
		const password = await this._passwordHash.hash(dto.password);

		const user = UserEntity.create({
			email: dto.email,
			password,
			name: dto.name,
			phone: dto.phone,
		});

		const auth = await this._userRepository.findOne({ email: user.email });
		if (auth) throw new Error(USER_MESSAGES.USER_ALREADY_EXSITS);

		const otp = this._otpService.generate(6);

		console.log("otp is: ", otp);

		await this._redisService.set(REDIS_KEYS.OTP.concat(user.email), otp, 300);

		await this._redisService.set(
			REDIS_KEYS.VERIFY_OTP.concat(user.email),
			JSON.stringify({
				...this._userMapper.toResponse(user),
				password: user.password,
			}),
		);

		this.eventEmitter.emit(AUTH_EVENTS.OTP_GENERATED, {
			email: user.email,
			name: user.name,
			otp,
		});

		return { otp, email: user.email };
	}
}
