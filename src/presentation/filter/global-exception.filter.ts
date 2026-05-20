import { BaseDomainException } from "@/domain/exceptions/base-execption";
import { type ExceptionFilter, Catch, type ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const timestamp = new Date().toISOString();
		const path = request.url;
		const requestId = request.id;

		if (exception instanceof BaseDomainException) {
			return response.status(exception.statusCode).json({
				success: false,
				error: {
					statusCode: exception.statusCode,
					timestamp,
					requestId,
					path,
					message: exception.message,
					code: exception.error,
				},
			});
		}

		if (exception instanceof HttpException) {
			const status = exception.getStatus();
			const res = exception.getResponse();

			let message: string | string[] = "Unexpected error";

			if (typeof res === "string") {
				message = res;
			} else if (typeof res === "object" && res !== null) {
				const body = res as Record<string, unknown>;
				message = (body.message as string) ?? "Unexpected error";
			}

			return response.status(status).json({
				success: false,
				error: {
					statusCode: status,
					timestamp,
					requestId,
					path,
					message,
					code: "HTTP_EXCEPTION",
				},
			});
		}

		const isProduction = process.env.NODE_ENV === "production";

		if (
			exception &&
			typeof exception === "object" &&
			(exception as Record<string, unknown>).code === "EBADCSRFTOKEN"
		) {
			return response.status(HttpStatus.FORBIDDEN).json({
				success: false,
				error: {
					statusCode: HttpStatus.FORBIDDEN,
					timestamp,
					requestId,
					path,
					message: "Invalid CSRF token",
					code: "EBADCSRFTOKEN",
				},
			});
		}

		if (!isProduction || (exception instanceof Error && !(exception instanceof BaseDomainException))) {
			console.error("Unhandled Exception:", exception);
		}

		const message =
			exception instanceof Error
				? isProduction && !(exception instanceof BaseDomainException)
					? "Internal Server Error"
					: exception.message
				: "Internal Server Error";

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			error: {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				timestamp,
				requestId,
				path,
				message,
				code: "INTERNAL_SERVER_ERROR",
			},
		});
	}
}
