import { MongoDbModule } from "./mongodb.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "./redis.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		RedisModule,
		MongoDbModule,
	],
})
export class AppModule {}
