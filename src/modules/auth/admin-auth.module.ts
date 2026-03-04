import { Module } from "@nestjs/common";
import { AdminLiteModule } from "../admin/admin-db.module";
import { CommonModule } from "../common.module";
import { AdminAuthController } from "@/presentation/controller/admin/implements/admin-auth.controller";
import { ADMIN_AUTH_TOKEN, COMMON_TOKEN } from "@/application/enums/tokens";
import { AdminLoginUseCase, AdminLogoutUseCase, AdminRefreshUseCase } from "@/application/use-case/auth/admin";
import { JwtService } from "@/infrastructure/services/implements";

@Module({
	imports: [AdminLiteModule, CommonModule],
	controllers: [AdminAuthController],
	providers: [
		{
			provide: ADMIN_AUTH_TOKEN.ADMIN_LOGIN_USE_CASE,
			useClass: AdminLoginUseCase,
		},
		{
			provide: ADMIN_AUTH_TOKEN.ADMIN_REFRESH_USE_CASE,
			useClass: AdminRefreshUseCase,
		},
		{
			provide: ADMIN_AUTH_TOKEN.ADMIN_LOGOUT_USE_CASE,
			useClass: AdminLogoutUseCase,
		},
		{
			provide: COMMON_TOKEN.JWT_SERVICE,
			useClass: JwtService,
		},
	],
})
export class AdminAuthModule {}
