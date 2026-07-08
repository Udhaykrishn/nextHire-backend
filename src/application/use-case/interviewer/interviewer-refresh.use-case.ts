import { Injectable, Inject, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { v4 as uuid } from "uuid";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { ENV_KEYS } from "@/application/enums";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { USER_ROLE, ROLE_PERMISSIONS } from "@/domain/enums";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "@/infrastructure/config/env.schema";
import { InterviewerRepository } from "@/infrastructure/db/mongodb/repository/interviewer/interviewer.repository";

export interface InterviewerRefreshResponseDto {
	accessToken: string;
	sessionId: string;
}

@Injectable()
export class InterviewerRefreshUseCase {
	constructor(
		private readonly _interviewerRepository: InterviewerRepository,

		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,

		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,

		private readonly configService: ConfigService<EnvConfig>,
	) {}

	async execute(sessionId: string): Promise<InterviewerRefreshResponseDto> {
		const oldKey = REDIS_KEYS.REFRESH.concat(sessionId);
		const refreshToken = await this._redisService.get(oldKey);

		if (!refreshToken) {
			throw new UnauthorizedException("Token expired or invalid token found");
		}

		const payload = this._jwtService.verifyToken<{
			id: string;
			email: string;
			role: string;
		}>(refreshToken);

		const interviewer = await this._interviewerRepository.findById(payload.id);

		if (!interviewer) {
			throw new BadRequestException("Invalid credentials");
		}

		const newPayload = {
			id: interviewer.id as string,
			role: USER_ROLE.INTERVIEWER,
			email: interviewer.email,
			permissions: ROLE_PERMISSIONS[USER_ROLE.INTERVIEWER],
		};

		const accessTokenExpiration = this.configService.get(ENV_KEYS.ACCESS_TOKEN_EXPIRATION);
		const refreshTokenExpiration = this.configService.get(ENV_KEYS.REFRESH_TOKEN_EXPIRATION);

		const accessToken = await this._jwtService.generateToken(newPayload, accessTokenExpiration);

		// Session rotation: delete old session, issue new sessionId + refreshToken
		const newSessionId = uuid();
		const newRefreshToken = await this._jwtService.generateToken(newPayload, refreshTokenExpiration);
		await this._redisService.del(oldKey);
		await this._redisService.set(REDIS_KEYS.REFRESH.concat(newSessionId), newRefreshToken);

		return {
			accessToken,
			sessionId: newSessionId,
		};
	}
}
