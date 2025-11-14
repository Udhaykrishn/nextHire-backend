import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";

export class ConflictException extends AppException {
	constructor(field: string) {
		super(
			"RESOURCE_CONFLICT",
			`${capitalize(field)} already exists`,
			HttpStatus.CONFLICT,
		);
	}
}

function capitalize(value: string): string {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
