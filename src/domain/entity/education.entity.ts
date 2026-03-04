export class EducationEntity {
	private readonly _id?: string;
	private _userId: string;
	private _institutionName: string;
	private _degree: string;
	private _fieldOfStudy: string;
	private _startDate: Date;
	private _endDate: Date;
	private _gpa: string;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		userId: string,
		institutionName: string,
		degree: string,
		fieldOfStudy: string,
		startDate: Date,
		endDate: Date,
		gpa: string,
		createdAt: Date,
		updatedAt: Date,
		id?: string,
	) {
		this._userId = userId;
		this._institutionName = institutionName;
		this._degree = degree;
		this._fieldOfStudy = fieldOfStudy;
		this._startDate = startDate;
		this._endDate = endDate;
		this._gpa = gpa;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		userId: string;
		institutionName: string;
		degree?: string;
		fieldOfStudy?: string;
		startDate?: Date;
		endDate?: Date;
		gpa?: string;
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): EducationEntity {
		return new EducationEntity(
			data.userId,
			data.institutionName,
			data.degree ?? "",
			data.fieldOfStudy ?? "",
			data.startDate ?? new Date(),
			data.endDate ?? new Date(),
			data.gpa ?? "",
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

	get institutionName(): string {
		return this._institutionName;
	}

	get degree(): string {
		return this._degree;
	}

	get fieldOfStudy(): string {
		return this._fieldOfStudy;
	}

	get startDate(): Date {
		return this._startDate;
	}

	get endDate(): Date {
		return this._endDate;
	}

	get gpa(): string {
		return this._gpa;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	changeInstitutionName(name: string): void {
		this._institutionName = name;
	}

	changeDegree(degree: string): void {
		this._degree = degree;
	}

	changeFieldOfStudy(field: string): void {
		this._fieldOfStudy = field;
	}

	changeStartDate(date: Date): void {
		this._startDate = date;
	}

	changeEndDate(date: Date): void {
		this._endDate = date;
	}

	changeGpa(gpa: string): void {
		this._gpa = gpa;
	}
}
