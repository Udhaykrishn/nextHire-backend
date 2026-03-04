export class AddressEntity {
	private readonly _id?: string;
	private _userId: string; // Added to link to user
	private _line1: string;
	private _line2: string;
	private _city: string;
	private _district: string;
	private _state: string;
	private _country: string;
	private _pincode: string;
	private _role: "user" | "company";
	private _createdAt: Date;
	private _updatedAt: Date;

	private constructor(
		userId: string,
		line1: string,
		line2: string,
		city: string,
		district: string,
		state: string,
		country: string,
		pincode: string,
		role: "user" | "company",
		createdAt: Date,
		updatedAt: Date,
		id?: string,
	) {
		this._userId = userId;
		this._line1 = line1;
		this._line2 = line2;
		this._city = city;
		this._district = district;
		this._state = state;
		this._country = country;
		this._pincode = pincode;
		this._role = role;
		this._createdAt = createdAt;
		this._updatedAt = updatedAt;
		this._id = id;
	}

	static create(data: {
		userId: string;
		line1: string;
		line2?: string;
		city: string;
		district: string;
		state: string;
		country: string;
		pincode: string;
		role: "user" | "company";
		createdAt?: Date;
		updatedAt?: Date;
		id?: string;
	}): AddressEntity {
		return new AddressEntity(
			data.userId,
			data.line1,
			data.line2 ?? "",
			data.city,
			data.district,
			data.state,
			data.country,
			data.pincode,
			data.role,
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

	get line1(): string {
		return this._line1;
	}

	get line2(): string {
		return this._line2;
	}

	get city(): string {
		return this._city;
	}

	get district(): string {
		return this._district;
	}

	get state(): string {
		return this._state;
	}

	get country(): string {
		return this._country;
	}

	get pincode(): string {
		return this._pincode;
	}

	get role(): "user" | "company" {
		return this._role;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	changeLine1(line1: string): void {
		this._line1 = line1;
	}

	changeLine2(line2: string): void {
		this._line2 = line2;
	}

	changeCity(city: string): void {
		this._city = city;
	}

	changeDistrict(district: string): void {
		this._district = district;
	}

	changeState(state: string): void {
		this._state = state;
	}

	changeCountry(country: string): void {
		this._country = country;
	}

	changePincode(pincode: string): void {
		this._pincode = pincode;
	}

	changeRole(role: "user" | "company"): void {
		this._role = role;
	}
}
