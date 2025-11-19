import { AUTH_USER_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import { UserLoginUseCase } from "@/application/use-case/auth/users/login.use-case";
import { AuthUserController } from "@/presentation/controller/user";
import { Module } from "@nestjs/common";
import { UserLiteModule } from "./user/user-db.module";
import { CommonModule } from "./user/common.module";
import { JwtService } from "@/infrastructure/services/implements";
import { JwtModule } from "@nestjs/jwt";
import { UserRefreshUseCase } from "@/application/use-case/auth/users/refresh.use-case";
import { UserRegisterUseCase } from "@/application/use-case/auth/users/register.use-case";
import { VerifyUserOtpUsecase } from "@/application/use-case/auth/users/verify-otp.use-case";
import { UserResendOtpUseCase } from "@/application/use-case/auth/users/resend-otp.use-case";
import { UserLogoutUseCase } from "@/application/use-case/auth/users";

@Module({
	imports: [
		UserLiteModule,
		CommonModule,
		JwtModule.register({
			global: true,
			secret: "nothingisimpossible",
		}),
	],
	controllers: [AuthUserController],
	providers: [
		{
			provide: AUTH_USER_TOKEN.USER_LOGIN_USE_CASE,
			useClass: UserLoginUseCase,
		},
		{
			provide: AUTH_USER_TOKEN.USER_REFRESH_USE_CASE,
			useClass: UserRefreshUseCase,
		},
		{
			provide: AUTH_USER_TOKEN.USER_RESEND_OTP_USE_CASE,
			useClass: UserResendOtpUseCase,
		},
		{
			provide: AUTH_USER_TOKEN.USER_REGISTER_USE_CASE,
			useClass: UserRegisterUseCase,
		},
		{
			provide: AUTH_USER_TOKEN.USER_VERIFY_OTP_USE_CASE,
			useClass: VerifyUserOtpUsecase,
		},
		{
			provide: COMMON_TOKEN.JWT_SERVICE,
			useClass: JwtService,
		},
		{
			provide: AUTH_USER_TOKEN.USER_LOGOUT_USE_CASE,
			useClass: UserLogoutUseCase,
		},
	],
})
export class AuthModule {}
