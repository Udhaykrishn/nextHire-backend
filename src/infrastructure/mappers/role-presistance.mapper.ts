import { RoleEntity } from "@/domain/entity/role.entity";
import type { RoleDocument } from "../db/mongodb/models/role.schema";
import type { Permission } from "../db/mongodb/models/permission.schema";

export class RolePresitanceMapper {
	toMongo(entity: RoleEntity) {
		return {
			name: entity.name,
			permissions: entity.permissions,
		};
	}

	fromMongo(doc: RoleDocument): RoleEntity {
		return RoleEntity.create({
			id: doc._id.toString(),
			name: doc.name,
			permissions: (doc.permissions as unknown as Permission[])?.map((p) => ({
				name: p.name,
			})),
		});
	}
}
