import { COMMON_TOKEN } from "@/application/enums/tokens";
import { OtpService, PasswordHash } from "@/infrastructure/services/implements";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		{ provide: COMMON_TOKEN.PASSWORD_HASH, useClass: PasswordHash },
		{
			provide: COMMON_TOKEN.OTP_SERVICE,
			useClass: OtpService,
		},
	],
	exports: [
		COMMON_TOKEN.PASSWORD_HASH,
		COMMON_TOKEN.OTP_SERVICE,
	],
})
export class CommonModule { }
