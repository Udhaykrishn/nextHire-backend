export enum APPLICATION_STATUS {
	PENDING = "PENDING",
	REVIEWING = "REVIEWING",
	SHORTLISTED = "SHORTLISTED",
	REJECTED = "REJECTED",
	HIRED = "HIRED",
}

export class JobApplicationEntity {
	private readonly _id?: string;
	private _userId: string;
	private _jobId: string;
	private _status: APPLICATION_STATUS;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		userId: string,
		jobId: string,
		status: APPLICATION_STATUS,
		createdAt: Date,
		updatedAt: Date,
		id?: string,
	) {
		this._id = id;
		this._userId = userId;
		this._jobId = jobId;
		this._status = status;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
	}

	static create(data: {
		userId: string;
		jobId: string;
		status?: APPLICATION_STATUS;
		id?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}): JobApplicationEntity {
		return new JobApplicationEntity(
			data.userId,
			data.jobId,
			data.status || APPLICATION_STATUS.PENDING,
			data.createdAt || new Date(),
			data.updatedAt || new Date(),
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get jobId(): string {
		return this._jobId;
	}

	get status(): APPLICATION_STATUS {
		return this._status;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	changeStatus(status: APPLICATION_STATUS): void {
		this._status = status;
		this._updatedAt = new Date();
	}
}
