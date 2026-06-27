export class NotificationEntity {
	private readonly _id?: string;
	private _recipient_id: string;
	private _title: string;
	private _message: string;
	private _is_read: boolean;
	private _type: string;
	private _metadata?: Record<string, unknown>;
	private _createdAt: Date;

	private constructor(
		recipient_id: string,
		title: string,
		message: string,
		is_read: boolean,
		type: string,
		createdAt: Date,
		id?: string,
		metadata?: Record<string, unknown>,
	) {
		this._id = id;
		this._recipient_id = recipient_id;
		this._title = title;
		this._message = message;
		this._is_read = is_read;
		this._type = type;
		this._metadata = metadata;
		this._createdAt = createdAt;
	}

	static create(data: {
		recipient_id: string;
		title: string;
		message: string;
		is_read?: boolean;
		type?: string;
		metadata?: Record<string, unknown>;
		createdAt?: Date;
		id?: string;
	}): NotificationEntity {
		return new NotificationEntity(
			data.recipient_id,
			data.title,
			data.message,
			data.is_read ?? false,
			data.type ?? "info",
			data.createdAt ?? new Date(),
			data.id,
			data.metadata,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get recipient_id(): string {
		return this._recipient_id;
	}

	get title(): string {
		return this._title;
	}

	get message(): string {
		return this._message;
	}

	get is_read(): boolean {
		return this._is_read;
	}

	get type(): string {
		return this._type;
	}

	get metadata(): Record<string, unknown> | undefined {
		return this._metadata;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	markAsRead(): void {
		this._is_read = true;
	}
}
