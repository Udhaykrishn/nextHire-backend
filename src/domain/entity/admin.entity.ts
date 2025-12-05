export class AdminEntity {
	private readonly _id?: string;
	private _email: string;
	private _password: string;
	private _name: string;
	private _createdAt: Date;

	private constructor(email: string, password: string, name: string, createdAt: Date, id?: string) {
		this._email = email;
		this._password = password;
		this._name = name;
		this._createdAt = createdAt;
		this._id = id;
	}

	static create(data: { email: string; password: string; name: string; createdAt?: Date; id?: string }): AdminEntity {
		return new AdminEntity(data.email, data.password, data.name, data.createdAt ?? new Date(), data.id);
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

	get name(): string {
		return this._name;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	changeEmail(newEmail: string): void {
		this._email = newEmail;
	}

	changePassword(newPassword: string): void {
		this._password = newPassword;
	}

	changeName(newName: string): void {
		this._name = newName;
	}
}
