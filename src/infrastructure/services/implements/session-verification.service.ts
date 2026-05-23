import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IRedisService, IOtpService } from "@/infrastructure/services/interface";
import type { ISessionVerificationService } from "../interface/session-verification-service.interface";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";

@Injectable()
export class SessionVerificationService implements ISessionVerificationService {
	constructor(
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.OTP_SERVICE)
		private readonly _otpService: IOtpService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	private getKey(userId: string, purpose: string): string {
		return `VERIFY_SESSION:${purpose}:${userId}`;
	}

	async startSession(
		userId: string,
		purpose: string,
		email: string,
		name: string,
		payload: Record<string, unknown>,
		expiresInSeconds = 86400,
	): Promise<{ otp: string }> {
		const otp = this._otpService.generate(6);
		const sessionData = {
			...payload,
			step: "OTP_VERIFICATION",
			otp,
		};

		await this._redisService.set(this.getKey(userId, purpose), JSON.stringify(sessionData), expiresInSeconds);

		await this.eventEmitter.emitAsync(AUTH_EVENTS.OTP_GENERATED, {
			email,
			name,
			otp,
		});

		return { otp };
	}

	async getSession(userId: string, purpose: string): Promise<Record<string, unknown> | null> {
		const session = await this._redisService.get(this.getKey(userId, purpose));
		if (!session) return null;
		return JSON.parse(session) as Record<string, unknown>;
	}

	async verifySession(userId: string, purpose: string, otp: string): Promise<Record<string, unknown>> {
		const sessionStr = await this._redisService.get(this.getKey(userId, purpose));
		if (!sessionStr) {
			throw new BadRequestException("Verification session expired or not found");
		}

		const sessionData = JSON.parse(sessionStr) as Record<string, unknown>;
		if (sessionData["otp"] !== otp) {
			throw new BadRequestException("Invalid OTP");
		}

		return sessionData;
	}

	async deleteSession(userId: string, purpose: string): Promise<void> {
		await this._redisService.del(this.getKey(userId, purpose));
	}
}
