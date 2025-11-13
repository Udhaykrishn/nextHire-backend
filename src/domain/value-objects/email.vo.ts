import { NotFoundException } from "@nestjs/common";
import { validate } from "deep-email-validator";
export class Email {
	private constructor(private readonly value: string) {}

	static async create(value: string): Promise<Email> {
		const { valid, reason } = await validate({
			email: value,
			// validateSMTP: true,
			// validateMx: true,
			// validateTypo: true,
			validateRegex: true,
		});
		if (!valid) {
			throw new NotFoundException(
				`Invalid email: ${reason || "Unknown error"}`,
			);
		}
		return new Email(value);
	}

	getValue(): string {
		return this.value;
	}
}
