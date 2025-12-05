import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { v4 as uuid } from "uuid";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { RECRUITER_TOKEN } from "@/application/enums/recruiter";
import type { IRecruiterRepository } from "@/application/interface/repository";
import { RecruiterEntity } from "@/domain/entity";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IPasswordHash, IRedisService } from "@/infrastructure/services/interface";
import { USER_ROLE } from "@/domain/enums/status";
import { RecruiterLoginDto, RecruiterLoginResponseDto } from "@/application/dto/auth/recruiter/login";

@Injectable()
export class RecruiterLoginUseCase implements IExecutable<RecruiterLoginDto, RecruiterLoginResponseDto> {
	constructor(
		@Inject(RECRUITER_TOKEN.RECRUITER_REPOSITORY)
		private readonly _recruiterRepository: IRecruiterRepository<RecruiterEntity>,

		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,

		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,

		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,
	) {}

	async execute(dto: RecruiterLoginDto): Promise<RecruiterLoginResponseDto> {
		const recruiter = await this._recruiterRepository.findOne({
			email: dto.email,
		});

		if (!recruiter) {
			throw new BadRequestException("Invalid credentials");
		}

		const isMatch = await this._passwordHash.compare(recruiter.password, dto.password);

		if (!isMatch) {
			throw new BadRequestException("Invalid credentials");
		}

		const payload = {
			id: recruiter.id as string,
			role: USER_ROLE.RECRUITER,
			email: recruiter.email,
		};

		const accessToken = await this._jwtService.generateToken(payload, COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR);

		const refreshToken = await this._jwtService.generateToken(payload, COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY);

		const sessionId = uuid();

		await this._redisService.set(`${REDIS_KEYS.REFRESH.concat(sessionId)}`, refreshToken);

		return {
			accessToken,
			sessionId,
		};
	}
}
