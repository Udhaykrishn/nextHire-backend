export class ProjectEntity {
	private readonly _id?: string;
	private _userId: string;
	private _projectName: string;
	private _description: string;
	private _startDate: Date;
	private _endDate: Date;
	private _url: string;
	private _githubUrls: { name: string; url: string }[];
	private _isCollaborative: boolean;
	private _skillsLearned: string[];
	private _createdAt: Date;
	private _updatedAt: Date;
	private _company: string;
	private _location: string;
	private _industry: string;
	private _role: string;
	private _currentlyWorking: boolean;
	private _employmentType: string;
	private _noticePeriod: string;

	private constructor(
		userId: string,
		projectName: string,
		description: string,
		startDate: Date,
		endDate: Date,
		url: string,
		githubUrls: { name: string; url: string }[],
		isCollaborative: boolean,
		skillsLearned: string[],
		createdAt: Date,
		updatedAt: Date,
		company: string,
		location: string,
		industry: string,
		role: string,
		currentlyWorking: boolean,
		employmentType: string,
		noticePeriod: string,
		id?: string,
	) {
		this._userId = userId;
		this._projectName = projectName;
		this._description = description;
		this._startDate = startDate;
		this._endDate = endDate;
		this._url = url;
		this._githubUrls = githubUrls;
		this._isCollaborative = isCollaborative;
		this._skillsLearned = skillsLearned;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._company = company;
		this._location = location;
		this._industry = industry;
		this._role = role;
		this._currentlyWorking = currentlyWorking;
		this._employmentType = employmentType;
		this._noticePeriod = noticePeriod;
		this._id = id;
	}

	static create(data: {
		userId: string;
		projectName: string;
		description?: string;
		startDate?: Date;
		endDate?: Date;
		url?: string;
		githubUrls?: { name: string; url: string }[];
		isCollaborative?: boolean;
		skillsLearned?: string[];
		company?: string;
		location?: string;
		industry?: string;
		role?: string;
		currentlyWorking?: boolean;
		employmentType?: string;
		noticePeriod?: string;
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
			data.githubUrls ?? [],
			data.isCollaborative ?? false,
			data.skillsLearned ?? [],
			data.createdAt ?? new Date(),
			data.updatedAt ?? new Date(),
			data.company ?? "",
			data.location ?? "",
			data.industry ?? "",
			data.role ?? "",
			data.currentlyWorking ?? false,
			data.employmentType ?? "",
			data.noticePeriod ?? "",
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

	get githubUrls(): { name: string; url: string }[] {
		return this._githubUrls;
	}

	get isCollaborative(): boolean {
		return this._isCollaborative;
	}

	get skillsLearned(): string[] {
		return this._skillsLearned;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	get company(): string {
		return this._company;
	}

	get location(): string {
		return this._location;
	}

	get industry(): string {
		return this._industry;
	}

	get role(): string {
		return this._role;
	}

	get currentlyWorking(): boolean {
		return this._currentlyWorking;
	}

	get employmentType(): string {
		return this._employmentType;
	}

	get noticePeriod(): string {
		return this._noticePeriod;
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

	changeCompany(company: string): void {
		this._company = company;
	}

	changeLocation(location: string): void {
		this._location = location;
	}

	changeIndustry(industry: string): void {
		this._industry = industry;
	}

	changeRole(role: string): void {
		this._role = role;
	}

	changeCurrentlyWorking(currentlyWorking: boolean): void {
		this._currentlyWorking = currentlyWorking;
	}

	changeEmploymentType(employmentType: string): void {
		this._employmentType = employmentType;
	}

	changeNoticePeriod(noticePeriod: string): void {
		this._noticePeriod = noticePeriod;
	}
}
