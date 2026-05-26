import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { Request, Response, NextFunction } from "express";
import csurf from "csurf";

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
	private csurfMiddleware = csurf({
		cookie: {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		},
	});

	use(req: Request, res: Response, next: NextFunction) {
		const excludedPaths = ["/auth/", "/health", "/metrics"];
		const isExcluded =
			excludedPaths.some((path) => req.originalUrl.includes(path)) && !req.originalUrl.includes("/csrf-token");

		if (isExcluded) {
			return next();
		}

		if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
			this.csurfMiddleware(req, res, (err) => {
				if (err) return next(err);
				res.cookie("XSRF-TOKEN", req.csrfToken(), {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					sameSite: "lax",
					path: "/",
				});
				next();
			});
			return;
		}

		this.csurfMiddleware(req, res, next);
	}
}
