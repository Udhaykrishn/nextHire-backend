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
	private _matchScore: number;
	private _matchBreakdown?: Record<string, unknown>;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		userId: string,
		jobId: string,
		status: APPLICATION_STATUS,
		matchScore: number,
		createdAt: Date,
		updatedAt: Date,
		id?: string,
		matchBreakdown?: Record<string, unknown>,
	) {
		this._id = id;
		this._userId = userId;
		this._jobId = jobId;
		this._status = status;
		this._matchScore = matchScore;
		this._matchBreakdown = matchBreakdown;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
	}

	static create(data: {
		userId: string;
		jobId: string;
		status?: APPLICATION_STATUS;
		matchScore?: number;
		matchBreakdown?: Record<string, unknown>;
		id?: string;
		createdAt?: Date;
		updatedAt?: Date;
	}): JobApplicationEntity {
		return new JobApplicationEntity(
			data.userId,
			data.jobId,
			data.status || APPLICATION_STATUS.PENDING,
			data.matchScore || 0,
			data.createdAt || new Date(),
			data.updatedAt || new Date(),
			data.id,
			data.matchBreakdown,
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

	get matchScore(): number {
		return this._matchScore;
	}

	get matchBreakdown(): Record<string, unknown> | undefined {
		return this._matchBreakdown;
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

	changeMatchScore(score: number): void {
		this._matchScore = score;
		this._updatedAt = new Date();
	}

	changeMatchBreakdown(breakdown: Record<string, unknown>): void {
		this._matchBreakdown = breakdown;
		this._updatedAt = new Date();
	}
}
