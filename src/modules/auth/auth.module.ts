import { Module } from "@nestjs/common";
import { UserAuthModule } from "./user-auth.module";
import { JwtModule } from "@nestjs/jwt";
import { COMMON_TOKEN } from "@/application/enums/tokens";
import { JwtService } from "@/infrastructure/services/implements";
import { RecruiterAuthModule } from "./recruiter-auth.module";
import { AdminAuthModule } from "./admin-auth.module";

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: "nothingispossible",
		}),
		UserAuthModule,
		RecruiterAuthModule,
		AdminAuthModule,
	],
	providers: [
		{
			provide: COMMON_TOKEN.JWT_SERVICE,
			useClass: JwtService,
		},
	],
	exports: [COMMON_TOKEN.JWT_SERVICE],
})
export class AuthModule { }
