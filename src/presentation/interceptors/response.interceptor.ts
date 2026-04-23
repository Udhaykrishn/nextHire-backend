import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<Record<string, unknown>> {
		const now = Date.now();
		const request = context.switchToHttp().getRequest();
		const response = context.switchToHttp().getResponse();

		return next.handle().pipe(
			map((data) => {
				const isProduction = process.env.NODE_ENV === "production";

				if (isProduction) {
					return {
						statusCode: response.statusCode,
						success: true,
						data: data,
					};
				}

				return {
					statusCode: response.statusCode,
					success: true,
					message: data?.message ?? "Request successful",
					timestamp: new Date().toISOString(),
					path: request.url,
					data: data,
					meta: {
						took: Date.now() - now,
						...(data?.meta || {}),
					},
				};
			}),
		);
	}
}
