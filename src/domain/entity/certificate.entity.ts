export class CertificateEntity {
	private readonly _id?: string;
	private _userId: string;
	private _certificateName: string;
	private _issuingOrganization: string;
	private _issueDate: Date;
	private _expirationDate: Date;
	private _certificateUrl: string;
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		userId: string,
		certificateName: string,
		issuingOrganization: string,
		issueDate: Date,
		expirationDate: Date,
		certificateUrl: string,
		createdAt: Date,
		updatedAt: Date,
		id?: string,
	) {
		this._userId = userId;
		this._certificateName = certificateName;
		this._issuingOrganization = issuingOrganization;
		this._issueDate = issueDate;
		this._expirationDate = expirationDate;
		this._certificateUrl = certificateUrl;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		userId: string;
		certificateName: string;
		issuingOrganization?: string;
		issueDate?: Date;
		expirationDate?: Date;
		certificateUrl?: string;
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): CertificateEntity {
		return new CertificateEntity(
			data.userId,
			data.certificateName,
			data.issuingOrganization ?? "",
			data.issueDate ?? new Date(),
			data.expirationDate ?? new Date(),
			data.certificateUrl ?? "",
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

	get certificateName(): string {
		return this._certificateName;
	}

	get issuingOrganization(): string {
		return this._issuingOrganization;
	}

	get issueDate(): Date {
		return this._issueDate;
	}

	get expirationDate(): Date {
		return this._expirationDate;
	}

	get certificateUrl(): string {
		return this._certificateUrl;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	changeCertificateName(name: string): void {
		this._certificateName = name;
	}

	changeIssuingOrganization(org: string): void {
		this._issuingOrganization = org;
	}

	changeIssueDate(date: Date): void {
		this._issueDate = date;
	}

	changeExpirationDate(date: Date): void {
		this._expirationDate = date;
	}

	changeCertificateUrl(url: string): void {
		this._certificateUrl = url;
	}
}
