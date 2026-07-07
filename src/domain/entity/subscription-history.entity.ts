export class SubscriptionHistoryEntity {
	private readonly _id?: string;
	private _user_id: string;
	private _payment_method: string;
	private _created_at: string;
	private _subscription_id: string;
	private _status: string;
	private _role: string;

	private constructor(
		user_id: string,
		payment_method: string,
		created_at: string,
		subscription_id: string,
		status: string,
		role: string,
		id?: string,
	) {
		this._user_id = user_id;
		this._payment_method = payment_method;
		this._created_at = created_at;
		this._subscription_id = subscription_id;
		this._status = status;
		this._role = role;
		this._id = id;
	}

	static create(data: {
		user_id: string;
		payment_method: string;
		created_at: string;
		subscription_id: string;
		status: string;
		role: string;
		id?: string;
	}): SubscriptionHistoryEntity {
		return new SubscriptionHistoryEntity(
			data.user_id,
			data.payment_method,
			data.created_at,
			data.subscription_id,
			data.status,
			data.role,
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get user_id(): string {
		return this._user_id;
	}

	get payment_method(): string {
		return this._payment_method;
	}

	get created_at(): string {
		return this._created_at;
	}

	get subscription_id(): string {
		return this._subscription_id;
	}

	get status(): string {
		return this._status;
	}

	get role(): string {
		return this._role;
	}
}
