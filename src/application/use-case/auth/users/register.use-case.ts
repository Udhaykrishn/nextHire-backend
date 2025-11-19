import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import {
	COMMON_TOKEN,
	USER_MAPPER,
	USERS_TOKEN,
} from "@/application/enums/tokens";
import type {
	IEmailService,
	IMailSender,
	IOtpService,
	IPasswordHash,
	IRedisService,
} from "@/infrastructure/services/interface";
import { USER_MESSAGES } from "@/domain/enums";
import { UserSignupDto } from "@/application/dto/auth/users/signup/user-signup.dto";
import { UserSignResponseDto } from "@/application/dto/auth/users/signup/user-signup-res.dto";
import type { IUserApplicationMappers } from "@/application/interface/mappers/user-application-mapper.interface";
import { UserType } from "@/infrastructure/db/mongodb/models/user.schema";

@Injectable()
export class UserRegisterUseCase
	implements IExecutable<UserSignupDto, UserSignResponseDto>
{
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.EMAIL_VALIDATOR)
		private readonly _emailValidation: IEmailService,
		@Inject(COMMON_TOKEN.OTP_SERVICE)
		private readonly _otpService: IOtpService,
		@Inject(COMMON_TOKEN.EMAIL_SERVICE)
		private readonly _emailService: IMailSender,
		@Inject(USER_MAPPER.USER_APPLICATION)
		private readonly _userMapper: IUserApplicationMappers<UserType>,
	) {}

	async execute(dto: UserSignupDto): Promise<UserSignResponseDto> {
		const email = await this._emailValidation.validate(dto.email);

		if (!email) {
			throw new UnauthorizedException("Invalid email address founded");
		}

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

		await this._redisService.set(`otp:${user.email}`, otp, 300);

		await this._redisService.set(
			`verify-pending:${user.email}`,
			JSON.stringify({
				...this._userMapper.toResponse(user),
				password: user.password,
			}),
		);

		await this._emailService.sendOtp(user.email, otp);

		return { otp, email: user.email };
	}
}
