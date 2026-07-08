import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type { IOtpService, IRedisService } from "@/infrastructure/services/interface";
import { USER_MESSAGES } from "@/domain/enums";
import { USER_ROLE } from "@/domain/enums/status";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { AUTH_EVENTS } from "@/domain/enums/events.enum";
import { EventEmitter2 } from "@nestjs/event-emitter";

type ResendOtpInput = { email: string; role?: string };

@Injectable()
export class UserResendOtpUseCase implements IExecutable<ResendOtpInput, { message: string }> {
	constructor(
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.OTP_SERVICE)
		private readonly _otpService: IOtpService,
		private readonly eventEmitter: EventEmitter2,
	) {}

	async execute(dto: ResendOtpInput): Promise<{ message: string }> {
		const email = dto.email;

		// Recruiter signup/verify store OTP under a ":recruiter"-suffixed key, so
		// the resend must target the same key or it "can't find the user".
		const suffix = dto.role === USER_ROLE.RECRUITER ? ":".concat(USER_ROLE.RECRUITER) : "";
		const verifyKey = REDIS_KEYS.VERIFY_OTP.concat(email, suffix);
		const otpKey = REDIS_KEYS.OTP.concat(email, suffix);
		const countKey = REDIS_KEYS.RESEND_COUNT.concat(email, suffix);

		const userDataString = await this._redisService.get(verifyKey);
		if (!userDataString) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}
		const userData = JSON.parse(userDataString);
		const name = userData.name || "User";

		let count = Number(await this._redisService.get(countKey)) || 0;
		if (count >= 3) {
			throw new BadRequestException("Resend limit reached. Try again after 10 minutes");
		}

		const ttl = await this._redisService.ttl(otpKey);
		const generateAndSend = async (message: string) => {
			const otp = this._otpService.generate(6);
			await this._redisService.set(otpKey, otp, 300);
			await this._redisService.set(countKey, String(++count), 600);

			this.eventEmitter.emit(AUTH_EVENTS.OTP_GENERATED, {
				email,
				name,
				otp,
			});

			return { message };
		};

		if (ttl === -2) {
			return generateAndSend("New OTP sent (previous OTP expired)");
		}

		if (ttl >= 0) {
			const age = 300 - ttl;
			if (age < 60) {
				throw new BadRequestException(`Please wait ${60 - age} seconds to resend OTP`);
			}
			return generateAndSend("OTP resent successfully");
		}

		throw new BadRequestException("Unexpected OTP state");
	}
}
