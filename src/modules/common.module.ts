import { COMMON_TOKEN } from "@/application/enums/tokens";
import {
	OtpService,
	PasswordHash,
	UuidService,
	SessionVerificationService,
	EventEmitterService,
	GroqAiService,
	PdfParserService,
} from "@/infrastructure/services/implements";
import { Module } from "@nestjs/common";

@Module({
	providers: [
		{ provide: COMMON_TOKEN.PASSWORD_HASH, useClass: PasswordHash },
		{ provide: COMMON_TOKEN.OTP_SERVICE, useClass: OtpService },
		{ provide: COMMON_TOKEN.UUID_SERVICE, useClass: UuidService },
		{ provide: COMMON_TOKEN.SESSION_VERIFICATION_SERVICE, useClass: SessionVerificationService },
		{ provide: COMMON_TOKEN.EVENT_EMITTER, useClass: EventEmitterService },
		{ provide: COMMON_TOKEN.AI_SERVICE, useClass: GroqAiService },
		{ provide: COMMON_TOKEN.PDF_PARSER_SERVICE, useClass: PdfParserService },
	],
	exports: [
		COMMON_TOKEN.PASSWORD_HASH,
		COMMON_TOKEN.OTP_SERVICE,
		COMMON_TOKEN.UUID_SERVICE,
		COMMON_TOKEN.SESSION_VERIFICATION_SERVICE,
		COMMON_TOKEN.EVENT_EMITTER,
		COMMON_TOKEN.AI_SERVICE,
		COMMON_TOKEN.PDF_PARSER_SERVICE,
	],
})
export class CommonModule {}
