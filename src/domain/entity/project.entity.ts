export class ProjectEntity {
	private readonly _id?: string;
	private _userId: string;
	private _projectName: string;
	private _description: string;
	private _startDate: Date;
	private _endDate: Date;
	private _url: string;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		userId: string,
		projectName: string,
		description: string,
		startDate: Date,
		endDate: Date,
		url: string,
		createdAt: Date,
		updatedAt: Date,
		id?: string,
	) {
		this._userId = userId;
		this._projectName = projectName;
		this._description = description;
		this._startDate = startDate;
		this._endDate = endDate;
		this._url = url;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		userId: string;
		projectName: string;
		description?: string;
		startDate?: Date;
		endDate?: Date;
		url?: string;
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): ProjectEntity {
		return new ProjectEntity(
			data.userId,
			data.projectName,
			data.description ?? "",
			data.startDate ?? new Date(),
			data.endDate ?? new Date(),
			data.url ?? "",
			data.createdAt ?? new Date(),
			data.updatedAt ?? new Date(),
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get userId(): string {
		return this._userId;
	}

	get projectName(): string {
		return this._projectName;
	}

	get description(): string {
		return this._description;
	}

	get startDate(): Date {
		return this._startDate;
	}

	get endDate(): Date {
		return this._endDate;
	}

	get url(): string {
		return this._url;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	changeProjectName(name: string): void {
		this._projectName = name;
	}

	changeDescription(desc: string): void {
		this._description = desc;
	}

	changeStartDate(date: Date): void {
		this._startDate = date;
	}

	changeEndDate(date: Date): void {
		this._endDate = date;
	}

	changeUrl(url: string): void {
		this._url = url;
	}
}
