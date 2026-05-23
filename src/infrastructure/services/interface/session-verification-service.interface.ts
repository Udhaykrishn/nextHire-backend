export interface ISessionVerificationService {
	startSession(
		userId: string,
		purpose: string,
		email: string,
		name: string,
		payload: Record<string, unknown>,
		expiresInSeconds?: number,
	): Promise<{ otp: string }>;
	getSession(userId: string, purpose: string): Promise<Record<string, unknown> | null>;
	verifySession(userId: string, purpose: string, otp: string): Promise<Record<string, unknown>>;
	deleteSession(userId: string, purpose: string): Promise<void>;
}
