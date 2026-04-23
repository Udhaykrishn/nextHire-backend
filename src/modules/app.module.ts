import { MongoDbModule } from "./mongodb.module";
import { type NestModule, type MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { BullModule } from "@nestjs/bullmq";
import { NotificationModule } from "./notification/notification.module";
import { RedisModule } from "./redis.module";
import { UserModule } from "./user";
import { RecruiterModule } from "./recruiter/recruiter.module";
import { AuthModule } from "./auth/auth.module";
import { envSchema } from "@/infrastructure/config";
import { CertificateModule } from "./certificate/certificate.module";
import { EducationModule } from "./education/education.module";
import { ProjectModule } from "./project/project.module";
import { AddressModule } from "./address/address.module";
import { OTelModule } from "./otel.module";
import { HealthController } from "@/presentation/controllers/health.controller";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { SecurityMiddleware } from "@/presentation/middleware/security.middleware";

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
				ttl: 60000,
				limit: 100,
			},
		]),
		EventEmitterModule.forRoot(),
		OTelModule,
		RedisModule,
		MongoDbModule.forRootAsync(),
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				connection: {
					url: configService.get("REDIS_URL"),
				},
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		UserModule,
		RecruiterModule,
		CertificateModule,
		EducationModule,
		ProjectModule,
		AddressModule,
		NotificationModule,
	],
	controllers: [HealthController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(SecurityMiddleware).forRoutes("*path");
	}
}
