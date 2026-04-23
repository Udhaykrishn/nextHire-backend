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
		// Exclude authentication routes from CSRF protection
		// as the user doesn't have a token yet.
		if (req.path.includes("/auth/")) {
			return next();
		}
		this.csurfMiddleware(req, res, next);
	}
}
