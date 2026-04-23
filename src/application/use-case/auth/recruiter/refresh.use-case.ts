// src/application/use-cases/auth/recruiter/refresh-recruiter.use-case.ts

import { Injectable, Inject, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";
import { RecruiterRefreshTokenDto } from "@/application/dto/auth/recruiter/refresh-response.dto";

@Injectable()
export class RecruiterRefreshUseCase implements IExecutable<string, RecruiterRefreshTokenDto> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,

		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {}

	async execute(sessionId: string): Promise<RecruiterRefreshTokenDto> {
		const refreshToken = await this._redisService.get(REDIS_KEYS.REFRESH.concat(sessionId));

		if (!refreshToken) {
			throw new UnauthorizedException("Token expired or invalid token found");
		}

		const payload = this._jwtService.verifyToken<{
			id: string;
			email: string;
			role: string;
		}>(refreshToken);

		const recruiter = await this._recruiterRepository.findById(payload.id);

		if (!recruiter) {
			throw new BadRequestException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		const accessToken = await this._jwtService.generateToken(payload, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		return { accessToken };
	}
}
