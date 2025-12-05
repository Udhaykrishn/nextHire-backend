import { RECRUITER_ROLE, RECRUITER_STATUS } from "../enums/status";

export class RecruiterEntity {
	private readonly _id?: string;

	private _email: string;
	private _password: string;
	private _name: string;
	private _phone: string;

	private _GSTIN: string = "";
	private _status: string = RECRUITER_STATUS.PENDING;
	private _website_link: string = "";
	private _description: string = "";
	private _category: string = "";
	private _company_role: string = RECRUITER_ROLE.HR;
	private _is_verified_company: boolean = false;
	private _admin_approved: boolean = false;

	private _subscription: {
		current_plan: string;
		is_subscribed: boolean;
	} = {
		current_plan: "free",
		is_subscribed: false,
	};

	private _createdAt: Date;
	private _updatedAt?: Date;

	private constructor(
		email: string,
		password: string,
		name: string,
		phone: string,
		GSTIN: string,
		status: string,
		website_link: string,
		description: string,
		category: string,
		company_role: string,
		is_verified_company: boolean,
		admin_approved: boolean,
		subscription: { current_plan: string; is_subscribed: boolean },
		createdAt: Date,
		updatedAt: Date | undefined,
		id?: string,
	) {
		this._email = email;
		this._password = password;
		this._name = name;
		this._phone = phone;
		this._GSTIN = GSTIN;
		this._status = status;
		this._website_link = website_link;
		this._description = description;
		this._category = category;
		this._company_role = company_role;
		this._is_verified_company = is_verified_company;
		this._admin_approved = admin_approved;
		this._subscription = subscription;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		email: string;
		password: string;
		name: string;
		phone: string;

		GSTIN?: string;
		status?: string;
		website_link?: string;
		description?: string;
		category?: string;
		company_role?: string;
		is_verified_company?: boolean;
		admin_approved?: boolean;
		subscription?: { current_plan: string; is_subscribed: boolean };

		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): RecruiterEntity {
		return new RecruiterEntity(
			data.email,
			data.password,
			data.name,
			data.phone,
			data.GSTIN ?? "",
			data.status ?? RECRUITER_STATUS.PENDING,
			data.website_link ?? "",
			data.description ?? "",
			data.category ?? "",
			data.company_role ?? RECRUITER_ROLE.HR,
			data.is_verified_company ?? false,
			data.admin_approved ?? false,
			data.subscription ?? { current_plan: "free", is_subscribed: false },
			data.createdAt ?? new Date(),
			data.updatedAt,
			data.id,
		);
	}

	// Getters
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

	get phone(): string {
		return this._phone;
	}

	get GSTIN(): string {
		return this._GSTIN;
	}

	get status(): string {
		return this._status;
	}

	get website_link(): string {
		return this._website_link;
	}

	get description(): string {
		return this._description;
	}

	get category(): string {
		return this._category;
	}

	get company_role(): string {
		return this._company_role;
	}

	get is_verified_company(): boolean {
		return this._is_verified_company;
	}

	get admin_approved(): boolean {
		return this._admin_approved;
	}

	get subscription(): { current_plan: string; is_subscribed: boolean } {
		return this._subscription;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date | undefined {
		return this._updatedAt;
	}

	changeName(name: string): void {
		this._name = name;
	}

	changePhone(phone: string): void {
		this._phone = phone;
	}

	changeGSTIN(GSTIN: string): void {
		this._GSTIN = GSTIN;
	}

	changeStatus(status: RECRUITER_STATUS): void {
		this._status = status;
	}

	changeWebsiteLink(website_link: string): void {
		this._website_link = website_link;
	}

	changeDescription(description: string): void {
		this._description = description;
	}

	changeCategory(category: string): void {
		this._category = category;
	}

	changeCompanyRole(company_role: RECRUITER_ROLE): void {
		this._company_role = company_role;
	}

	verifyCompany(): void {
		this._is_verified_company = true;
	}

	approveByAdmin(): void {
		this._admin_approved = true;
	}

	changeSubscription(subscription: {
		current_plan: string;
		is_subscribed: boolean;
	}): void {
		this._subscription = subscription;
	}

	changeEmail(newEmail: string): void {
		this._email = newEmail;
	}

	changePassword(newPassword: string): void {
		this._password = newPassword;
	}

	updateTimestamps(createdAt?: Date, updatedAt?: Date): void {
		if (createdAt) this._createdAt = createdAt;
		if (updatedAt) this._updatedAt = updatedAt;
	}
}
