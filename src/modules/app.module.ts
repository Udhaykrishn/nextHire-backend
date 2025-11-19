import { MongoDbModule } from "./mongodb.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "./redis.module";
import { UserModule } from "./user";
import { AuthModule } from "./auth.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		RedisModule,
		MongoDbModule.forRootAsync(),
		//  EmailQueueModule,
		AuthModule,
		UserModule,
	],
})
export class AppModule {}
