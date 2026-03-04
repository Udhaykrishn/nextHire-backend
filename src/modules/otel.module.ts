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
                apiMetrics: {
                    enable: true,
                    defaultAttributes: {
                        service: "nexthire-backend",
                    },
                    ignoreRoutes: ["/favicon.ico", "/health", "/metrics"],
                    ignoreUndefinedRoutes: false,
                    prefix: "nexthire",
                },
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
export class OTelModule { }
