export class RoleEntity {
	private readonly _id?: string;
	private _name: string;
	private _permissions: { name: string }[];

	private constructor(name: string, permissions: { name: string }[], id?: string) {
		this._name = name;
		this._permissions = permissions;
		this._id = id;
	}

	static create(data: { name: string; permissions?: { name: string }[]; id?: string }): RoleEntity {
		return new RoleEntity(data.name, data.permissions ?? [], data.id);
	}

	get id(): string | undefined {
		return this._id;
	}

	get name(): string {
		return this._name;
	}

	get permissions(): { name: string }[] {
		return this._permissions;
	}
}
