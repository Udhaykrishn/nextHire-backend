import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { ForgotPasswordDto, ForgotPasswordResponseDto } from "@/application/dto/auth/users";
import { USERS_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { USER_STATUS, USER_MESSAGES, USER_ROLE } from "@/domain/enums";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { ENV_KEYS } from "@/application/enums";
import { ConfigService } from "@nestjs/config";
import { PASSWORD_MESSAGES } from "@/domain/enums/messages";
import { EnvConfig } from "@/infrastructure/config/env.schema";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class UserForgotPasswordUseCase implements IExecutable<ForgotPasswordDto, ForgotPasswordResponseDto> {
	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		private readonly configService: ConfigService<EnvConfig>,
		private readonly eventEmitter: EventEmitter2,
	) { }

	async execute(dto: ForgotPasswordDto): Promise<ForgotPasswordResponseDto> {
		const user = await this._userRepository.findOne({ email: dto.email });
		if (!user) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		if (user.status === USER_STATUS.BLOCK) {
			throw new BadRequestException(USER_MESSAGES.USER_BLOCKED_BY_ADMIN);
		}

		const payload = {
			id: user.id as string,
			email: user.email,
			role: USER_ROLE.USER,
		};

		const expirationTime = this.configService.get(ENV_KEYS.RESET_TOKEN_EXPIRATION);

		const token = await this._jwtService.generateToken(payload, expirationTime);

		await this._redisService.set(`${REDIS_KEYS.RESET_TOKEN}${token}`, user.id as string, expirationTime);

		const frontendUrl = this.configService.get(ENV_KEYS.FRONTEND_API);
		const link = `${frontendUrl}/reset-password?token=${token}&type=${USER_ROLE.USER}`;

		this.eventEmitter.emit(AUTH_EVENTS.FORGOT_PASSWORD, {
			email: user.email,
			link,
			name: user.name,
		});

		return {
			message: PASSWORD_MESSAGES.PASSWORD_RESET_LINK_SENT,
		};
	}
}
