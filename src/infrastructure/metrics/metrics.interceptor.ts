import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { MetricsService } from "./metrics.service";
import type { Request, Response } from "express";

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
	private activeRequests = 0;

	constructor(private readonly metricsService: MetricsService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const httpCtx = context.switchToHttp();
		const request = httpCtx.getRequest<Request>();
		const response = httpCtx.getResponse<Response>();

		const startTime = Date.now();
		this.activeRequests++;
		this.metricsService.httpActiveRequests.record(this.activeRequests);

		// Derive a clean route pattern (use the matched route, not the actual URL with params)
		const route = request.route?.path ?? request.path ?? "unknown";
		const method = request.method;

		return next.handle().pipe(
			tap({
				next: () => {
					this.activeRequests--;
					this.metricsService.httpActiveRequests.record(this.activeRequests);

					const durationMs = Date.now() - startTime;
					this.metricsService.recordHttpRequest(method, route, response.statusCode, durationMs);
				},
				error: () => {
					this.activeRequests--;
					this.metricsService.httpActiveRequests.record(this.activeRequests);

					const durationMs = Date.now() - startTime;
					this.metricsService.recordHttpRequest(
						method,
						route,
						response.statusCode >= 400 ? response.statusCode : 500,
						durationMs,
					);
				},
			}),
		);
	}
}
