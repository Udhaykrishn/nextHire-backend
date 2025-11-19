import { COMMON_TOKEN } from "@/application/enums/tokens";
import {
	EmailValidator,
	MailSender,
	OtpService,
	PasswordHash,
} from "@/infrastructure/services/implements";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		{ provide: COMMON_TOKEN.PASSWORD_HASH, useClass: PasswordHash },
		{ provide: COMMON_TOKEN.EMAIL_VALIDATOR, useClass: EmailValidator },
		{ provide: COMMON_TOKEN.EMAIL_SERVICE, useClass: MailSender },
		{
			provide: COMMON_TOKEN.OTP_SERVICE,
			useClass: OtpService,
		},
	],
	exports: [
		COMMON_TOKEN.PASSWORD_HASH,
		COMMON_TOKEN.EMAIL_SERVICE,
		COMMON_TOKEN.EMAIL_VALIDATOR,
		COMMON_TOKEN.OTP_SERVICE,
	],
})
export class CommonModule {}
