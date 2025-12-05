import { MongoDbModule } from "./mongodb.module";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RedisModule } from "./redis.module";
import { UserModule } from "./user";
import { RecruiterModule } from "./recruiter/recruiter.module";
import { AuthModule } from "./auth/auth.module";
import { envSchema } from "@/infrastructure/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			validate: (env) => envSchema.parse(env),
			cache: true,
		}),
		ThrottlerModule.forRoot([
			{
				name: "short",
				ttl: 60000,
				limit: 10,
			},
		]),
		RedisModule,
		MongoDbModule.forRootAsync(),
		//  EmailQueueModule,
		AuthModule,
		UserModule,
		RecruiterModule,
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
