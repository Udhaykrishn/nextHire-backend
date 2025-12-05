import { Injectable } from "@nestjs/common";
import { validate } from "deep-email-validator";
import type { IEmailService } from "../interface/email-service.interface";

@Injectable()
export class EmailValidator implements IEmailService {
	async validate(email: string): Promise<boolean> {
		const { valid, reason, validators } = await validate({
			email,
			validateSMTP: true,
			validateRegex: true,
			validateMx: true,
			validateTypo: true,
			validateDisposable: true,
		});

		console.log("reason ", reason);
		console.log("validators", validators);

		return valid;
	}
}
