import { JwtService as NestJwtService } from "@nestjs/jwt";
import type { IJwtService } from "../interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtService implements IJwtService {
	constructor(private readonly jwt: NestJwtService) {}

	async generateToken(
		payload: Record<string, unknown>,
		expiresIn: number = 15 * 60,
	): Promise<string> {
		console.log("exp: ", expiresIn);
		return await this.jwt.signAsync(payload, { expiresIn });
	}

	verifyToken<T>(token: string): T {
		try {
			return this.jwt.verify(token) as T;
		} catch (err) {
			console.log(err);
			throw new Error("Invalid or expired token", err);
		}
	}
}
