export class InterviewerEntity {
	private readonly _id?: string;
	private _email: string;
	private _createdBy: string;
	private _role: string;
	private _companyId: string;
	private _password: string;
	private _department: string;
	private _createdAt?: Date;
	private _updatedAt?: Date;

	private constructor(
		email: string,
		createdBy: string,
		role: string,
		companyId: string,
		password: string,
		department: string,
		createdAt?: Date,
		updatedAt?: Date,
		id?: string,
	) {
		this._email = email;
		this._createdBy = createdBy;
		this._role = role;
		this._companyId = companyId;
		this._password = password;
		this._department = department;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		email: string;
		createdBy: string;
		role: string;
		companyId: string;
		password: string;
		department: string;
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): InterviewerEntity {
		return new InterviewerEntity(
			data.email,
			data.createdBy,
			data.role,
			data.companyId,
			data.password,
			data.department,
			data.createdAt,
			data.updatedAt,
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get email(): string {
		return this._email;
	}

	get createdBy(): string {
		return this._createdBy;
	}

	get role(): string {
		return this._role;
	}

	get companyId(): string {
		return this._companyId;
	}

	get password(): string {
		return this._password;
	}

	get department(): string {
		return this._department;
	}

	get createdAt(): Date | undefined {
		return this._createdAt;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	changeDepartment(department: string): void {
		this._department = department;
	}

	changePassword(password: string): void {
		this._password = password;
	}
}
