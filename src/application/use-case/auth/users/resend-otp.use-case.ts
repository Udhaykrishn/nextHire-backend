import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { IExecutable } from "@/application/interface/executable.interface";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import type {
	IMailSender,
	IOtpService,
	IRedisService,
} from "@/infrastructure/services/interface";
import { USER_MESSAGES } from "@/domain/enums";
import { REDIS_KEYS } from "@/domain/enums/keys";
import { VerifyOTPDto } from "@/application/dto/auth/users/otp";

@Injectable()
export class UserResendOtpUseCase
	implements IExecutable<VerifyOTPDto, { message: string }>
{
	constructor(
		@Inject(COMMON_TOKEN.REDIS_SERVICE)
		private readonly _redisService: IRedisService,
		@Inject(COMMON_TOKEN.OTP_SERVICE)
		private readonly _otpService: IOtpService,
		@Inject(COMMON_TOKEN.EMAIL_SERVICE)
		private readonly _mailSender: IMailSender,
	) {}

	async execute(dto: VerifyOTPDto): Promise<{ message: string }> {
		const email = dto.email;

		const verifyKey = REDIS_KEYS.VERIFY_OTP.concat(email);
		const otpKey = REDIS_KEYS.OTP.concat(email);
		const countKey = REDIS_KEYS.RESEND_COUNT.concat(email);

		if (!(await this._redisService.get(verifyKey))) {
			throw new BadRequestException(USER_MESSAGES.USER_NOT_FOUND);
		}

		let count = Number(await this._redisService.get(countKey)) || 0;
		if (count >= 3) {
			throw new BadRequestException(
				"Resend limit reached. Try again after 10 minutes",
			);
		}

		const ttl = await this._redisService.ttl(otpKey);
		const generateAndSend = async (message: string) => {
			const otp = this._otpService.generate(6);
			await this._redisService.set(otpKey, otp, 300);
			await this._redisService.set(countKey, String(++count), 600);
			await this._mailSender.sendOtp(email, otp);

			return { message };
		};

		if (ttl === -2) {
			return generateAndSend("New OTP sent (previous OTP expired)");
		}

		if (ttl >= 0) {
			const age = 300 - ttl;
			if (age < 60) {
				throw new BadRequestException(
					`Please wait ${60 - age} seconds to resend OTP`,
				);
			}
			return generateAndSend("OTP resent successfully");
		}

		throw new BadRequestException("Unexpected OTP state");
	}
}
