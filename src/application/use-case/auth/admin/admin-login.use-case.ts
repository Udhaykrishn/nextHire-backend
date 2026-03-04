import { Injectable, Inject, UnauthorizedException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IAdminRepository } from "@/application/interface/repository";
import { AdminEntity } from "@/domain/entity";
import { COMMON_TOKEN, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IPasswordHash, IRedisService } from "@/infrastructure/services/interface";
import { USER_ROLE, ADMIN_MESSAGES } from "@/domain/enums";
import { v4 as uuid } from "uuid";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { ENV_KEYS } from "@/application/enums";
import { AdminLoginDto, AdminLoginResponseDto } from "@/application/dto/auth/admin";
import { ConfigService } from "@nestjs/config";
import { EnvConfig } from "@/infrastructure/config/env.schema";

@Injectable()
export class AdminLoginUseCase implements IExecutable<AdminLoginDto, AdminLoginResponseDto> {
	constructor(
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY)
		private readonly _adminRepository: IAdminRepository<AdminEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.PASSWORD_HASH)
		private readonly _passwordHash: IPasswordHash,
		private readonly configService: ConfigService<EnvConfig>,
	) {}

	async execute(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
		const admin = await this._adminRepository.findOne({ email: dto.email });

		if (!admin) {
			throw new UnauthorizedException(ADMIN_MESSAGES.INVALID_CREDENTIALS);
		}

		const isMatch = await this._passwordHash.compare(admin.password, dto.password);

		if (!isMatch) {
			throw new UnauthorizedException(ADMIN_MESSAGES.INVALID_CREDENTIALS);
		}

		const payload = {
			id: admin.id as string,
			role: USER_ROLE.ADMIN,
			email: admin.email,
		};

		const accessTokenExpiration = this.configService.get(ENV_KEYS.ACCESS_TOKEN_EXPIRATION);
		const refreshTokenExpiration = this.configService.get(ENV_KEYS.REFRESH_TOKEN_EXPIRATION);

		const accessToken = await this._jwtService.generateToken(payload, accessTokenExpiration);
		const refreshToken = await this._jwtService.generateToken(payload, refreshTokenExpiration);

		const sessionId = uuid();

		this._redisService.set(`${REDIS_KEYS.REFRESH.concat(sessionId)}`, refreshToken);

		return { accessToken: accessToken, sessionId };
	}
}
