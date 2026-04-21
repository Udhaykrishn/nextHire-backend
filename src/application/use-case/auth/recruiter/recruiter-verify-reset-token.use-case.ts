import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter/recruiter-token.enum";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity/recruiter.entity";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { RECRUITER_MESSAGES, USER_MESSAGES } from "@/domain/enums/messages";
import { REDIS_KEYS } from "@/domain/enums/keys";
import type { AuthPayload } from "@/domain/types";

@Injectable()
export class RecruiterVerifyResetTokenUseCase implements IExecutable<string, boolean> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {}

	async execute(token: string): Promise<boolean> {
		const storedToken = await this._redisService.get(`${REDIS_KEYS.RESET_TOKEN}${token}`);
		if (!storedToken) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN);
		}

		let payload: AuthPayload;
		try {
			payload = this._jwtService.verifyToken(token) as AuthPayload;
		} catch (_e) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN);
		}

		if (!payload.email) {
			throw new BadRequestException(USER_MESSAGES.INVALID_TOKEN_PAYLOAD);
		}

		const recruiter = await this._recruiterRepository.findOne({ email: payload.email });
		if (!recruiter) {
			throw new BadRequestException(RECRUITER_MESSAGES.RECRUITER_NOT_FOUND);
		}

		return true;
	}
}
