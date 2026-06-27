import { Injectable, Inject } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IAdminRepository } from "@/application/interface/repository";
import { AdminEntity } from "@/domain/entity";
import { COMMON_TOKEN, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { REDIS_KEYS } from "@/domain/enums/keys";

@Injectable()
export class AdminLogoutUseCase implements IExecutable<string, boolean> {
	constructor(
		@Inject(ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY)
		private readonly _adminRepository: IAdminRepository<AdminEntity>,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
	) {}

	async execute(sessionId: string): Promise<boolean> {
		const refreshToken = await this._redisService.get(REDIS_KEYS.REFRESH.concat(sessionId));

		if (!refreshToken) {
			return true;
		}

		try {
			const payload = this._jwtService.verifyToken<{
				id: string;
				email: string;
				role: string;
			}>(refreshToken);

			const admin = await this._adminRepository.findById(payload.id);

			if (!admin) {
				this._redisService.del(REDIS_KEYS.REFRESH.concat(sessionId));
				return true;
			}
		} catch (_error) {
			// Ignore token verification errors during logout to allow cleanup
		}

		this._redisService.del(REDIS_KEYS.REFRESH.concat(sessionId));

		return true;
	}
}
