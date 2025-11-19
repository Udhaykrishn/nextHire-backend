import { UserController } from "@/presentation/controller/user";
import { Module } from "@nestjs/common";
import { UserCrudModule } from "./user-curd.module";
@Module({
	imports: [UserCrudModule],
	controllers: [UserController],
	exports: [],
})
export class UserModule {}
