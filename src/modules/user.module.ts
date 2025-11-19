import { Module } from "@nestjs/common";
import { UserLiteModule } from "./user/user-db.module";
import { UserController } from "@/presentation/controller/user";
import { CommonModule } from "./user/common.module";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard, RefreshGuard, RoleGuard } from "@/presentation/guards";
import { UserCrudModule } from "./user/user-curd.module";

@Module({
	imports: [UserLiteModule, UserCrudModule, CommonModule],

	controllers: [UserController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RoleGuard,
		},
		{
			provide: APP_GUARD,
			useClass: RefreshGuard,
		},
	],
	exports: [],
})
export class UserModule {}
