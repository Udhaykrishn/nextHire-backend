import { Response, CookieOptions } from "express";

export const optional: CookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
	path: "/",
};

export function setCookie(res: Response, key: string, value: string, maxAge: number) {
	res.cookie(key, value, {
		...optional,
		maxAge,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	});
}

export function clearCookie(res: Response, key: string) {
	res.clearCookie(key, {
		...optional,
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	});
}
