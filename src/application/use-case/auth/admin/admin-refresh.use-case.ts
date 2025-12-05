import {
    Injectable,
    Inject,
    UnauthorizedException,
    BadRequestException,
} from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IAdminRepository } from "@/application/interface/repository";
import { AdminEntity } from "@/domain/entity";
import { COMMON_TOKEN, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import type {
    IJwtService,
    IRedisService,
} from "@/infrastructure/services/interface";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";

export class AdminRefreshTokenDto {
    accessToken: string;
}

@Injectable()
export class AdminRefreshUseCase
    implements IExecutable<string, AdminRefreshTokenDto> {
    constructor(
        @Inject(ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY)
        private readonly _adminRepository: IAdminRepository<AdminEntity>,
        @Inject(COMMON_TOKEN.JWT_SERVICE)
        private readonly _jwtService: IJwtService,
        @Inject(COMMON_TOKEN.REDIS_SERVICE)
        private readonly _redisService: IRedisService,
    ) { }

    async execute(sessionId: string): Promise<AdminRefreshTokenDto> {
        const refreshToken = await this._redisService.get(
            `${REDIS_KEYS.REFRESH.concat(sessionId)}`,
        );

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

        const accessToken = await this._jwtService.generateToken(
            payload,
            COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR,
        );

        return { accessToken };
    }
}
