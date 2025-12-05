export class AccountBlockedException extends Error {
	constructor() {
		super("Your account has been blocked by admin");
		this.name = "AccountBlockedException";
	}
}