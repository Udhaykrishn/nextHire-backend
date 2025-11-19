export interface IJwtService {
	verifyToken<T>(token: string): T;
	generateToken(
		payload: Record<string, unknown>,
		expireIn?: number,
	): Promise<string>;
}
