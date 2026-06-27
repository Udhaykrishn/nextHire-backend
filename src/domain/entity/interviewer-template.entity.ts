export class InterviewerTemplateEntity {
	private readonly _id?: string;
	private _companyId: string;
	private _name: string;
	private _description?: string;
	private _duration: number;
	private _rubric: string[];
	private _createdAt?: Date;
	private _updatedAt?: Date;

	private constructor(
		companyId: string,
		name: string,
		duration: number,
		rubric: string[],
		description?: string,
		createdAt?: Date,
		updatedAt?: Date,
		id?: string,
	) {
		this._companyId = companyId;
		this._name = name;
		this._duration = duration;
		this._rubric = rubric;
		this._description = description;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		companyId: string;
		name: string;
		duration: number;
		rubric: string[];
		description?: string;
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): InterviewerTemplateEntity {
		return new InterviewerTemplateEntity(
			data.companyId,
			data.name,
			data.duration,
			data.rubric,
			data.description,
			data.createdAt,
			data.updatedAt,
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get companyId(): string {
		return this._companyId;
	}

	get name(): string {
		return this._name;
	}

	get description(): string | undefined {
		return this._description;
	}

	get duration(): number {
		return this._duration;
	}

	get rubric(): string[] {
		return this._rubric;
	}

	get createdAt(): Date | undefined {
		return this._createdAt;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	changeName(name: string): void {
		this._name = name;
	}

	changeDescription(description: string): void {
		this._description = description;
	}

	changeDuration(duration: number): void {
		this._duration = duration;
	}

	changeRubric(rubric: string[]): void {
		this._rubric = rubric;
	}
}
