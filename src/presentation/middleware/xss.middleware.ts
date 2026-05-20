import type { NextFunction, Request, Response } from "express";
import { FilterXSS } from "xss";

const xssFilter = new FilterXSS();

/**
 * Recursively sanitizes data using the xss library.
 * @param data The data to sanitize
 * @returns Clean data
 */
function sanitize<T>(data: T): T {
	if (typeof data === "string") {
		return xssFilter.process(data) as unknown as T;
	}
	if (Array.isArray(data)) {
		return data.map((item) => sanitize(item)) as unknown as T;
	}
	if (typeof data === "object" && data !== null) {
		const clean = {} as Record<string, unknown>;
		for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
			clean[key] = sanitize(value);
		}
		return clean as unknown as T;
	}
	return data;
}

export function xssMiddleware(req: Request, _res: Response, next: NextFunction) {
	if (req.body) req.body = sanitize(req.body);

	// Note: req.query is made writable in main.ts via Object.defineProperty
	if (req.query) {
		req.query = sanitize(req.query);
	}

	if (req.params) req.params = sanitize(req.params);
	next();
}
