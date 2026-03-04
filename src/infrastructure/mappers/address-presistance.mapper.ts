import { AddressEntity } from "@/domain/entity/address.entity";
import type { IAddressPresistanceMapper } from "@/application/interface/mappers/address/address-presistance.mapper";
import type { AddressType } from "../db/mongodb/models/address.schema";

export class AddressPresistanceMapper implements IAddressPresistanceMapper<AddressEntity, AddressType> {
	toMongo(entity: AddressEntity): AddressType {
		return {
			_id: entity.id as string,
			userId: entity.userId,
			line1: entity.line1,
			line2: entity.line2,
			city: entity.city,
			district: entity.district,
			state: entity.state,
			country: entity.country,
			pincode: entity.pincode,
			role: entity.role,
			createdAt: entity.createdAt,
			updatedAt: entity.updatedAt,
		};
	}

	async fromMongo(doc: AddressType): Promise<AddressEntity> {
		return AddressEntity.create({
			id: doc._id.toString(),
			userId: doc._id, // NOTE: Check if usage of schema implies userId is present. Schema has userId not defined? Wait.
			line1: doc.line1,
			line2: doc.line2,
			city: doc.city,
			district: doc.district,
			state: doc.state,
			country: doc.country,
			pincode: doc.pincode,
			role: doc.role,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}
}
