import { Injectable, Inject, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IAdminRepository } from "@/application/interface/repository";
import { AdminEntity } from "@/domain/entity";
import { COMMON_TOKEN, ADMIN_AUTH_TOKEN } from "@/application/enums/tokens";
import type {
    IJwtService,
    IPasswordHash,
    IRedisService,
} from "@/infrastructure/services/interface";
import { USER_ROLE } from "@/domain/enums";
import { v4 as uuid } from "uuid";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";
import {
    AdminLoginDto,
    AdminLoginResponseDto,
} from "@/application/dto/auth/admin";

@Injectable()
export class AdminLoginUseCase
    implements IExecutable<AdminLoginDto, AdminLoginResponseDto> {
    constructor(
        @Inject(ADMIN_AUTH_TOKEN.ADMIN_REPOSITORY)
        private readonly _adminRepository: IAdminRepository<AdminEntity>,
        @Inject(COMMON_TOKEN.JWT_SERVICE)
        private readonly _jwtService: IJwtService,
        @Inject(COMMON_TOKEN.REDIS_SERVICE)
        private readonly _redisService: IRedisService,
        @Inject(COMMON_TOKEN.PASSWORD_HASH)
        private readonly _passwordHash: IPasswordHash,
    ) { }

    async execute(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
        const admin = await this._adminRepository.findOne({ email: dto.email });

        if (!admin) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isMatch = await this._passwordHash.compare(
            admin.password,
            dto.password,
        );

        if (!isMatch) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload = {
            id: admin.id as string,
            role: USER_ROLE.ADMIN,
            email: admin.email,
        };

        const accessToken = await this._jwtService.generateToken(
            payload,
            COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR,
        );
        const refreshToken = await this._jwtService.generateToken(
            payload,
            COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY,
        );

        const sessionId = uuid();

        this._redisService.set(
            `${REDIS_KEYS.REFRESH.concat(sessionId)}`,
            refreshToken,
        );

        return { accessToken: accessToken, sessionId };
    }
}
