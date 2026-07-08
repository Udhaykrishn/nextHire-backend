import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { ENV_KEYS } from "@/application/enums";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IPasswordHash, IRedisService } from "@/infrastructure/services/interface";
import { USER_ROLE, ROLE_PERMISSIONS } from "@/domain/enums";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "@/infrastructure/config/env.schema";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";

export interface InterviewerLoginDto {
	email: string;
	password?: string;
}

export interface InterviewerLoginResponseDto {
	accessToken: string;
	sessionId: string;
}

@Injectable()
export class InterviewerLoginUseCase {
	constructor(
		private readonly _interviewerRepository: InterviewerRepository,

		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,

		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,

		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,
		private readonly configService: ConfigService<EnvConfig>,
	) {}

	async execute(dto: InterviewerLoginDto): Promise<InterviewerLoginResponseDto> {
		const interviewer = await this._interviewerRepository.findByEmail(dto.email);

		if (!interviewer) {
			throw new BadRequestException("Invalid credentials");
		}

		const rawPassword = dto.password || "";
		const isMatch = await this._passwordHash.compare(interviewer.password, rawPassword);

		if (!isMatch) {
			throw new BadRequestException("Invalid credentials");
		}

		const payload = {
			id: interviewer.id as string,
			role: USER_ROLE.INTERVIEWER,
			email: interviewer.email,
			permissions: ROLE_PERMISSIONS[USER_ROLE.INTERVIEWER],
		};

		const accessTokenExpiration = this.configService.get(ENV_KEYS.ACCESS_TOKEN_EXPIRATION);
		const refreshTokenExpiration = this.configService.get(ENV_KEYS.REFRESH_TOKEN_EXPIRATION);

		const accessToken = await this._jwtService.generateToken(payload, accessTokenExpiration);
		const refreshToken = await this._jwtService.generateToken(payload, refreshTokenExpiration);

		const sessionId = uuid();

		await this._redisService.set(`${REDIS_KEYS.REFRESH.concat(sessionId)}`, refreshToken);

		return {
			accessToken,
			sessionId,
		};
	}
}
