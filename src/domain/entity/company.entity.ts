export class CompanyEntity {
	private _id: string;
	private _name: string;
	private _logo_url?: string;
	private _website?: string;
	private _industry?: string;
	private _company_size?: string;
	private _location?: string;
	private _about?: string;
	private _ownerId: string;
	private _isActive: boolean;

	constructor(data: {
		id: string;
		name: string;
		logo_url?: string;
		website?: string;
		industry?: string;
		company_size?: string;
		location?: string;
		about?: string;
		ownerId: string;
		isActive?: boolean;
	}) {
		this._id = data.id;
		this._name = data.name;
		this._logo_url = data.logo_url;
		this._website = data.website;
		this._industry = data.industry;
		this._company_size = data.company_size;
		this._location = data.location;
		this._about = data.about;
		this._ownerId = data.ownerId;
		this._isActive = data.isActive ?? true;
	}

	get id(): string {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get logo_url(): string | undefined {
		return this._logo_url;
	}

	get website(): string | undefined {
		return this._website;
	}

	get industry(): string | undefined {
		return this._industry;
	}

	get company_size(): string | undefined {
		return this._company_size;
	}

	get location(): string | undefined {
		return this._location;
	}

	get about(): string | undefined {
		return this._about;
	}

	get ownerId(): string {
		return this._ownerId;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	toJSON() {
		return {
			id: this._id,
			name: this._name,
			logo_url: this._logo_url,
			website: this._website,
			industry: this._industry,
			company_size: this._company_size,
			location: this._location,
			about: this._about,
			ownerId: this._ownerId,
			isActive: this._isActive,
		};
	}
}
