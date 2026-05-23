import { COMMON_TOKEN } from "@/application/enums/tokens";
import {
	OtpService,
	PasswordHash,
	UuidService,
	SessionVerificationService,
} from "@/infrastructure/services/implements";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		{ provide: COMMON_TOKEN.PASSWORD_HASH, useClass: PasswordHash },
		{ provide: COMMON_TOKEN.OTP_SERVICE, useClass: OtpService },
		{ provide: COMMON_TOKEN.UUID_SERVICE, useClass: UuidService },
		{ provide: COMMON_TOKEN.SESSION_VERIFICATION_SERVICE, useClass: SessionVerificationService },
	],
	exports: [
		COMMON_TOKEN.PASSWORD_HASH,
		COMMON_TOKEN.OTP_SERVICE,
		COMMON_TOKEN.UUID_SERVICE,
		COMMON_TOKEN.SESSION_VERIFICATION_SERVICE,
	],
})
export class CommonModule {}
