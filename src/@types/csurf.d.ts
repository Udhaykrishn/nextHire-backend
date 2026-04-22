import * as express from "express";

declare module "csurf" {
	namespace csurf {
		interface CookieOptions extends express.CookieOptions {
			key?: string;
			httpOnly?: boolean;
			secure?: boolean;
			sameSite?: boolean | "lax" | "strict" | "none";
		}

		interface Options {
			value?: (req: express.Request) => string;
			cookie?: boolean | CookieOptions;
			sessionKey?: string;
			ignoreMethods?: string[];
		}
	}

	function csurf(options?: csurf.Options): express.RequestHandler;

	export default csurf;
}
