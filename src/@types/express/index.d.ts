declare global {
	namespace Express {
		interface Request {
			id?: string;
			csrfToken(): string;
			sessionId: string;
			user: {
				email: string;
				id: string;
				role: string;
			};
		}
	}
}

export {};
