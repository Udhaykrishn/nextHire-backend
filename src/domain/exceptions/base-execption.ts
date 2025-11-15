export abstract class BaseDomainException extends Error {
	public readonly statusCode: number;
	public readonly error: string;

	constructor({
		message,
		statusCode,
		error,
	}: {
		message: string;
		statusCode: number;
		error: string;
	}) {
		super(message);
		this.message = message;
		this.statusCode = statusCode;
		this.error = error;
	}
}
