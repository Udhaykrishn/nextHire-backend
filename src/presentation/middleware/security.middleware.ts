import { Injectable, type NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { v4 as uuid } from "uuid";

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
	use(req: Request, res: Response, next: NextFunction) {
		req.id = req.id || uuid();
		res.setHeader("X-Request-Id", req.id);

		if (req.method === "GET" && !req.url.includes(".")) {
			try {
				const token = req.csrfToken();
				res.setHeader("X-XSRF-TOKEN", token);
			} catch (_e) {}
		}

		next();
	}
}
