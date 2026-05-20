import { Injectable, Inject, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IAdminRepository } from "@/application/interface/repository";
import { AdminEntity } from "@/domain/entity";
import { COMMON_TOKEN, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService, IUuidService } from "@/infrastructure/services/interface";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";

export class AdminRefreshTokenDto {
	accessToken: string;
	sessionId: string;
}

@Injectable()
export class AdminRefreshUseCase implements IExecutable<string, AdminRefreshTokenDto> {
	constructor(
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY)
		private readonly _adminRepository: IAdminRepository<AdminEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.UUID_SERVICE)
		private readonly _uuidService: IUuidService,
	) { }

	async execute(sessionId: string): Promise<AdminRefreshTokenDto> {
		const oldKey = REDIS_KEYS.REFRESH.concat(sessionId);
		const refreshToken = await this._redisService.get(oldKey);

		if (!refreshToken) {
			throw new UnauthorizedException("Token expired or Invalid Token found");
		}

		const payload = this._jwtService.verifyToken<{
			id: string;
			email: string;
			role: string;
		}>(refreshToken);

		const admin = await this._adminRepository.findById(payload.id);

		if (!admin) {
			throw new BadRequestException("Admin not found");
		}

		const accessTokenPayload = {
			id: payload.id,
			email: payload.email,
			role: payload.role,
		};

		const accessToken = await this._jwtService.generateToken(
			accessTokenPayload,
			COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR,
		);

		// Session rotation: delete old session, issue new sessionId + refreshToken
		const newSessionId = this._uuidService.generate();
		const newRefreshToken = await this._jwtService.generateToken(
			accessTokenPayload,
			COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY,
		);
		await this._redisService.del(oldKey);
		this._redisService.set(REDIS_KEYS.REFRESH.concat(newSessionId), newRefreshToken);

		return { accessToken, sessionId: newSessionId };
	}
}

