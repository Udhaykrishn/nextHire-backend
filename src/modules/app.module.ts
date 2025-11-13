import { MongoDbModule } from "./mongodb.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "./redis.module";
import { UserModule } from "./user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		RedisModule,
		MongoDbModule.forRootAsync(),
		UserModule,
	],
})
export class AppModule {}
