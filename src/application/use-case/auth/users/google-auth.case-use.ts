import { Injectable, Inject, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import type { IUserRepository } from "@/application/interface/repository";
import { UserEntity } from "@/domain/entity";
import { COMMON_TOKEN, USERS_TOKEN } from "@/application/enums/tokens";
import type { IJwtService, IRedisService } from "@/infrastructure/services/interface";
import { USER_MESSAGES, USER_ROLE, USER_STATUS } from "@/domain/enums";
import { v4 as uuid } from "uuid";
import { COOKIE_MAX_AGE_CONSTANT } from "@/domain/constants/cookie.constant";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { UserLoginResponseDto } from "@/application/dto/auth/users";
import { GoogleAuthDto } from "@/application/dto/auth/users/login/auth-login.dto";
import { OAuth2Client } from "google-auth-library";

interface GooglePayload {
	email: string;
	email_verified: boolean;
	name: string;
	picture: string;
	sub: string;
}

@Injectable()
export class GoogleAuthUseCase implements IExecutable<GoogleAuthDto, UserLoginResponseDto> {
	private client: OAuth2Client;

	constructor(
		@Inject(USERS_TOKEN.USER_REPOSITORY)
		private readonly _userRepository: IUserRepository<UserEntity>,
		@Inject(COMMON_TOKEN.JWT_SERVICE)
		private readonly _jwtService: IJwtService,
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
	) {
		const clientId = process.env.GOOGLE_CLIENT_ID as string;
		if (!clientId) {
			throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
		}
		this.client = new OAuth2Client(clientId);
	}

	async execute(dto: GoogleAuthDto): Promise<UserLoginResponseDto> {
		try {
			const ticket = await this.client.verifyIdToken({
				idToken: dto.credential,
				audience: process.env.GOOGLE_CLIENT_ID,
			});

			const payload = ticket.getPayload() as GooglePayload;

			if (!payload) {
				throw new UnauthorizedException("Invalid Google token");
			}

			if (!payload.email_verified) {
				throw new UnauthorizedException("Google account email not verified");
			}

			let auth = await this._userRepository.findOne({ email: payload.email });

			if (!auth) {
				auth = await this._userRepository.findOne({ google_id: payload.sub });
			}

			if (!auth) {
				const randomPassword = Math.floor(10000000 + Math.random() * 90000000).toString();
				const user = UserEntity.create({
					email: payload.email,
					password: randomPassword,
					name: payload.name,
					google_id: payload.sub,
					status: USER_STATUS.ACTIVE,
				});
				auth = await this._userRepository.save(user);
			} else if (!auth.google_id || auth.google_id === "") {
				auth.changeGoogleId(payload.sub);
				await this._userRepository.findByIdAndUpdate(auth.id as string, auth);
			}

			if (!auth) {
				throw new Error("Failed to create or find user");
			}

			if (auth.status === USER_STATUS.BLOCK) {
				throw new BadRequestException(USER_MESSAGES.USER_BLOCKED_BY_ADMIN);
			}

			const jwtPayload = {
				id: auth.id as string,
				role: USER_ROLE.USER,
				email: auth.email,
			};

			const accessToken = await this._jwtService.generateToken(
				jwtPayload,
				COOKIE_MAX_AGE_CONSTANT.ACCESS_TOKEN_1_HOUR,
			);
			const refreshToken = await this._jwtService.generateToken(
				jwtPayload,
				COOKIE_MAX_AGE_CONSTANT.REFRESH_TOKEN_7_DAY,
			);

			const sessionId = uuid();

			await this._redisService.set(`${REDIS_KEYS.REFRESH.concat(sessionId)}`, refreshToken);

			return { accessToken, sessionId, isProfileComplete: auth.isProfileComplete() };
		} catch (error) {
			if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
				throw error;
			}
			throw new UnauthorizedException(`${error.message}`);
		}
	}
}
