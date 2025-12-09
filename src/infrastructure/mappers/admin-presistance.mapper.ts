import { AdminEntity } from "@/domain/entity";
import type { IAdminPresitanceMapper } from "@/application/interface/mappers/admin/admin-presistance.mapper";
import type { AdminType } from "../db/mongodb/models/admin.schema";

export class AdminPresitanceMapper implements IAdminPresitanceMapper<AdminEntity, AdminType> {
	toMongo(admin: AdminEntity) {
		return {
			email: admin.email,
			password: admin.password,
		} as any;
	}

	async fromMongo(doc: AdminType): Promise<AdminEntity> {
		return AdminEntity.create({
			id: doc._id.toString(),
			email: doc.email,
			password: doc.password,
		});
	}
}
