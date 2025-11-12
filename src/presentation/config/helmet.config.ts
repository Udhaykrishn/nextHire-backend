export const helmetConfigOptions: Record<string, unknown> = {
	noSniff: true,
	frameguard: { action: "deny" },

	referrerPolicy: { policy: "no-referrer" },

	dnsPrefetchControl: { allow: false },

	crossOriginEmbedderPolicy: true,
	crossOriginOpenerPolicy: { policy: "same-origin" },
	crossOriginResourcePolicy: { policy: "same-origin" },

	hsts: {
		maxAge: 31536000,
		includeSubDomains: true,
		preload: true,
	},
	contentSecurityPolicy: {
		useDefaults: true,
		directives: {
			"default-src": ["'self'"],
			"script-src": ["'self'", "'unsafe-inline'"],
			"object-src": ["'none'"],
			"style-src": ["'self'", "'unsafe-inline'"],
			"img-src": ["'self'", "data:"],
		},
	},
};
