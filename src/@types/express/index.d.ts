declare global {
	namespace Express {
		interface Request {
			sessionId: string;
			user: {
				email: string,
				id: string,
				role: string
			}
		}
	}
}

export { };
