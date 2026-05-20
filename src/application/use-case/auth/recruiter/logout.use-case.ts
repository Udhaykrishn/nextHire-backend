import { Injectable, Inject, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { RECRUITER_MESSAGES } from "@/domain/enums/messages";

@Injectable()
export class RecruiterLogoutUseCase implements IExecutable<string, boolean> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
	) {}

	async execute(sessionId: string): Promise<boolean> {
		const refreshToken = await this._redisService.get(REDIS_KEYS.REFRESH.concat(sessionId));

		if (!refreshToken) {
			throw new UnauthorizedException("Token missing ");
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

		this._redisService.del(REDIS_KEYS.REFRESH.concat(sessionId));

		return true;
	}
}
