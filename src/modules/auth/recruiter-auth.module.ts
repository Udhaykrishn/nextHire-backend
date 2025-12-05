import { Module } from "@nestjs/common";
import { RecruiterLiteModule } from "../recruiter/recuriter-lite.module";
import { CommonModule } from "../common.module";
import { AuthRecruiterController } from "@/presentation/controller/recruiter";
import { AUTH_RECRUITER_TOKEN } from "@/application/enums/recruiter";
import {
	RecruiterLoginUseCase,
	RecruiterRegisterUseCase,
	VerifyRecruiterOtpUseCase,
	RecruiterRefreshUseCase,
} from "@/application/use-case/auth/recruiter";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import { JwtService } from "@/infrastructure/services/implements";

@Module({
	imports: [RecruiterLiteModule, CommonModule],
	controllers: [AuthRecruiterController],
	providers: [
		{
			provide: AUTH_RECRUITER_TOKEN.RECRUITER_LOGIN_USE_CASE,
			useClass: RecruiterLoginUseCase,
		},
		{
			provide: AUTH_RECRUITER_TOKEN.RECRUITER_REGISTER_USE_CASE,
			useClass: RecruiterRegisterUseCase,
		},
		{
			provide: AUTH_RECRUITER_TOKEN.RECRUITER_VERIFY_OTP_USE_CASE,
			useClass: VerifyRecruiterOtpUseCase,
		},
		{
			provide: AUTH_RECRUITER_TOKEN.RECRUITER_REFRESH_USE_CASE,
			useClass: RecruiterRefreshUseCase,
		},
		{
			provide: COMMON_TOKEN.JWT_SERVICE,
			useClass: JwtService,
		},
	],
})
export class RecruiterAuthModule {}
