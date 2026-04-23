import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Permission, PermissionSchema } from "@/infrastructure/db/mongodb/models/permission.schema";
import { Role, RoleSchema } from "@/infrastructure/db/mongodb/models/role.schema";
import { User, UserSchema } from "@/infrastructure/db/mongodb/models/user.schema";
import { Recruiter, Recruiterschema } from "@/infrastructure/db/mongodb/models/company.schema";
import { Admin, AdminSchema } from "@/infrastructure/db/mongodb/models/admin.schema";
import { PermissionSeeder } from "@/infrastructure/db/mongodb/seed/permission.seed";
import { RBAC_TOKEN } from "@/application/enums/tokens/rbac-token.enum";
import { RoleRepository } from "@/infrastructure/db/mongodb/repository/role.repository";

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Permission.name, schema: PermissionSchema },
			{ name: Role.name, schema: RoleSchema },
			{ name: User.name, schema: UserSchema },
			{ name: Recruiter.name, schema: Recruiterschema },
			{ name: Admin.name, schema: AdminSchema },
		]),
	],
	providers: [
		PermissionSeeder,
		{
			provide: RBAC_TOKEN.ROLE_REPOSITORY,
			useClass: RoleRepository,
		},
	],
	exports: [MongooseModule, RBAC_TOKEN.ROLE_REPOSITORY],
})
export class RBACModule {}
