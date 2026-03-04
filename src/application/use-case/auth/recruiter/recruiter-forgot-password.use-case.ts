import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { RecruiterForgotPasswordDto, RecruiterForgotPasswordResponseDto } from "@/application/dto/auth/recruiter";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { ConfigService } from "@nestjs/config";
import { PASSWORD_MESSAGES, RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { ENV_KEYS } from "@/application/enums";
import { EnvConfig } from "@/infrastructure/config/env.schema";
import { USER_ROLE } from "@/domain/enums";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class RecruiterForgotPasswordUseCase
	implements IExecutable<RecruiterForgotPasswordDto, RecruiterForgotPasswordResponseDto> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		private readonly configService: ConfigService<EnvConfig>,
		private readonly eventEmitter: EventEmitter2,
	) { }

	async execute(dto: RecruiterForgotPasswordDto): Promise<RecruiterForgotPasswordResponseDto> {
		const recruiter = await this._recruiterRepository.findOne({ email: dto.email });
		if (!recruiter) {
			throw new BadRequestException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		const payload = {
			id: recruiter.id as string,
			email: recruiter.email,
			role: USER_ROLE.RECRUITER,
		};

		const expirationTime = this.configService.get(ENV_KEYS.RESET_TOKEN_EXPIRATION);

		const token = await this._jwtService.generateToken(payload, expirationTime);

		await this._redisService.set(`${REDIS_KEYS.RESET_TOKEN}${token}`, recruiter.id as string, expirationTime);

		const frontendUrl = this.configService.get(ENV_KEYS.FRONTEND_API);
		const link = `${frontendUrl}/reset-password?token=${token}&type=${USER_ROLE.RECRUITER}`;

		this.eventEmitter.emit(AUTH_EVENTS.FORGOT_PASSWORD, {
			email: recruiter.email,
			link,
			name: recruiter.name,
		});

		return {
			message: PASSWORD_MESSAGES.PASSWORD_RESET_LINK_SENT,
		};
	}
}
