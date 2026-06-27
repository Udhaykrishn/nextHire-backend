export class ChatEntity {
	private readonly _id?: string;
	private _sender_id: string;
	private _receiver_id: string;
	private _message: string;
	private _is_viewed: boolean;
	private _created_at: Date;
	private _message_type: string;
	private _file_url: string | null;
	private _file_name: string | null;
	private _file_size: number | null;
	private _file_key: string | null;

	private constructor(
		sender_id: string,
		receiver_id: string,
		message: string,
		is_viewed: boolean,
		created_at: Date,
		message_type: string,
		file_url: string | null,
		file_name: string | null,
		file_size: number | null,
		file_key: string | null,
		id?: string,
	) {
		this._id = id;
		this._sender_id = sender_id;
		this._receiver_id = receiver_id;
		this._message = message;
		this._is_viewed = is_viewed;
		this._created_at = created_at;
		this._message_type = message_type;
		this._file_url = file_url;
		this._file_name = file_name;
		this._file_size = file_size;
		this._file_key = file_key;
	}

	static create(data: {
		sender_id: string;
		receiver_id: string;
		message: string;
		is_viewed?: boolean;
		created_at?: Date;
		message_type?: string;
		file_url?: string | null;
		file_name?: string | null;
		file_size?: number | null;
		file_key?: string | null;
		id?: string;
	}): ChatEntity {
		return new ChatEntity(
			data.sender_id,
			data.receiver_id,
			data.message,
			data.is_viewed ?? false,
			data.created_at ?? new Date(),
			data.message_type ?? "text",
			data.file_url ?? null,
			data.file_name ?? null,
			data.file_size ?? null,
			data.file_key ?? null,
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get sender_id(): string {
		return this._sender_id;
	}

	get receiver_id(): string {
		return this._receiver_id;
	}

	get message(): string {
		return this._message;
	}

	get is_viewed(): boolean {
		return this._is_viewed;
	}

	get created_at(): Date {
		return this._created_at;
	}

	get message_type(): string {
		return this._message_type;
	}

	get file_url(): string | null {
		return this._file_url;
	}

	get file_name(): string | null {
		return this._file_name;
	}

	get file_size(): number | null {
		return this._file_size;
	}

	get file_key(): string | null {
		return this._file_key;
	}

	markAsViewed(): void {
		this._is_viewed = true;
	}
}
