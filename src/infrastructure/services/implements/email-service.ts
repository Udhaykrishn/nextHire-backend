import { Injectable } from "@nestjs/common";
import { validate } from "deep-email-validator";
import type { IEmailService } from "../interface/email-service.interface";

@Injectable()
export class EmailService implements IEmailService {
	async validate(email: string): Promise<boolean> {
		const { valid } = await validate({
			email,
			validateDisposable: true,
			validateMx: true,
			validateRegex: true,
			validateSMTP: true,
			validateTypo: true,
		});

		return valid;
	}
}
