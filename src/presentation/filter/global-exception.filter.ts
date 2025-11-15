import { BaseDomainException } from "@/domain/exceptions/base-execption";
import {
	type ExceptionFilter,
	Catch,
	type ArgumentsHost,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import type { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const timestamp = new Date().toISOString();
		const path = request.url;

		if (exception instanceof BaseDomainException) {
			return response.status(exception.statusCode).json({
				success: false,
				error: {
					statusCode: exception.statusCode,
					timestamp,
					path,
					message: exception.message,
					error: exception.error,
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
					path,
					message,
					error: "HTTP_EXCEPTION",
				},
			});
		}

		return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
			success: false,
			error: {
				statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
				timestamp,
				path,
				message:
					exception instanceof Error
						? exception.message
						: "Internal Server Error",
				error: "INTERNAL_SERVER_ERROR",
			},
		});
	}
}
