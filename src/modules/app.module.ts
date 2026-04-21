import { MongoDbModule } from "./mongodb.module";
import { Module } from "@nestjs/common";
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

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ".env",
			validate: (env) => envSchema.parse(env),
			cache: true,
		}),
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
})
export class AppModule {}
