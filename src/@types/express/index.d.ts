declare global {
	namespace Express {
		interface Request {
			id?: string;
			csrfToken(): string;
			sessionId: string;
			user: {
				email: string;
				id: string;
				companyId?: string;
				role: string;
				permissions: string[];
			};
		}
	}
}

export {};
