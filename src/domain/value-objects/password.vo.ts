import { hash, verify } from "argon2";

export class Password {
	private constructor(private readonly hashedValue: string) {}

	static async create(plainPassword: string): Promise<Password> {
		if (!plainPassword || plainPassword.length < 8) {
			throw new Error("Password must be at least 8 characters long");
		}

		const hashed = await hash(plainPassword, { parallelism: 2 });

		return new Password(hashed);
	}

	async verify(plainPassword: string): Promise<boolean> {
		return verify(this.hashedValue, plainPassword);
	}

	getValue() {
		return this.hashedValue;
	}
}
