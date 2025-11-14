import { BaseDomainException } from "./base-execption";
import { HttpStatus } from "@nestjs/common";

export class AlreadyExistsException extends BaseDomainException {
	constructor(message: string) {
		super({
			message,
			statusCode: HttpStatus.BAD_REQUEST,
			error: "ALREADY_EXISTS",
		});
	}
}
