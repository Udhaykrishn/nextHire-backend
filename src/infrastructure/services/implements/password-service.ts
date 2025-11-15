import * as argon2 from "argon2";
import type { IPasswordHash } from "../interface/password-hash.interface";

export class PasswordHash implements IPasswordHash {
	async compare(password: string, plain: string): Promise<boolean> {
		return await argon2.verify(password, plain);
	}
	async hash(password: string): Promise<string> {
		return await argon2.hash(password, {
			parallelism: 2,
			type: argon2.argon2id,
			memoryCost: 2 ** 16,
			timeCost: 3,
		});
	}
}
