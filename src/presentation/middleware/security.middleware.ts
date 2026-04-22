import { Injectable, type NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
	private readonly logger = new Logger(SecurityMiddleware.name);

	use(req: Request, res: Response, next: NextFunction) {
		req.id = req.id || uuid();
		res.setHeader("X-Request-Id", req.id);

		if (req.method === "GET" && !req.url.includes(".") && typeof req.csrfToken === "function") {
			try {
				const token = req.csrfToken();
				res.setHeader("X-XSRF-TOKEN", token);
			} catch (error) {
				this.logger.warn(
					`CSRF Token generation failed for ${req.url}: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}

		next();
	}
}
