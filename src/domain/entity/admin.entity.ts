export class AdminEntity {
	private readonly _id?: string;
	private _email: string;
	private _password: string;

	private constructor(email: string, password: string, id?: string) {
		this._email = email;
		this._password = password;
		this._id = id;
	}

	static create(data: { email: string; password: string; id?: string }): AdminEntity {
		return new AdminEntity(data.email, data.password);
	}

	get id(): string | undefined {
		return this._id;
	}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	changeEmail(newEmail: string): void {
		this._email = newEmail;
	}

	changePassword(newPassword: string): void {
		this._password = newPassword;
	}

}
