export class SubscriptionEntity {
	private readonly _id?: string;
	private _name: string;
	private _created_at: string;
	private _status: string;
	private _amount: string;
	private _subscription_type: string;
	private _descriptions: string;

	private constructor(
		name: string,
		created_at: string,
		status: string,
		amount: string,
		subscription_type: string,
		descriptions: string,
		id?: string,
	) {
		this._id = id;
		this._name = name;
		this._created_at = created_at;
		this._status = status;
		this._amount = amount;
		this._subscription_type = subscription_type;
		this._descriptions = descriptions;
	}

	static create(data: {
		name: string;
		created_at?: string;
		status?: string;
		amount: string;
		subscription_type: string;
		descriptions?: string;
		id?: string;
	}): SubscriptionEntity {
		return new SubscriptionEntity(
			data.name,
			data.created_at || new Date().toISOString(),
			data.status || "ACTIVE",
			data.amount,
			data.subscription_type,
			data.descriptions || "",
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}
	get name(): string {
		return this._name;
	}
	get created_at(): string {
		return this._created_at;
	}
	get status(): string {
		return this._status;
	}
	get amount(): string {
		return this._amount;
	}
	get subscription_type(): string {
		return this._subscription_type;
	}
	get descriptions(): string {
		return this._descriptions;
	}
}
