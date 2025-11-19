import { Response, CookieOptions } from "express";

export const optional: CookieOptions = {
	httpOnly: true,
	secure: false,
	sameSite: "lax",
	path: "/",
};

export function setCookie(
	res: Response,
	key: string,
	value: string,
	maxAge: number,
) {
	res.cookie(key, value, { ...optional, maxAge });
}

export function clearCookie(res: Response, key: string) {
	res.clearCookie(key, { ...optional });
}
