import type { Request, Response, NextFunction } from "express";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
export const hppMiddleware = hpp();
import { sanitize } from "express-xss-sanitizer";

export const mongoSanitizeMiddleware = (req: Request, _res: Response, next: NextFunction) => {
	if (req.body) mongoSanitize.sanitize(req.body, {});
	if (req.query) mongoSanitize.sanitize(req.query, {});
	if (req.params) mongoSanitize.sanitize(req.params, {});
	next();
};

export const xssMiddleware = (req: Request, _res: Response, next: NextFunction) => {
	if (req.body) {
		req.body = sanitize(req.body);
	}
	if (req.query) {
		const sanitizedQuery = sanitize(req.query);
		Object.assign(req.query, sanitizedQuery);
	}
	if (req.params) {
		const sanitizedParams = sanitize(req.params);
		Object.assign(req.params, sanitizedParams);
	}
	next();
};
