import { Module, Global } from "@nestjs/common";
import { OpenTelemetryModule } from "nestjs-otel";
import { MetricsService, MetricsInterceptor } from "@/infrastructure/metrics";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Global()
@Module({
	imports: [
		OpenTelemetryModule.forRoot({
			metrics: {
				hostMetrics: true,
			},
		}),
	],
	providers: [
		MetricsService,
		{
			provide: APP_INTERCEPTOR,
			useClass: MetricsInterceptor,
		},
	],
	exports: [MetricsService],
})
export class OTelModule {}
