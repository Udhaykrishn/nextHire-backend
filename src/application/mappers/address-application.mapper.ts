import { AddressEntity } from "@/domain/entity/address.entity";
import type { ResponseAddressDto } from "@/application/dto/address/response-address.dto";
import type { IAddressApplicationMapper } from "@/application/interface/mappers/address/address-application-mapper.interface";
import type { AddressType } from "@/infrastructure/db/mongodb/models/address.schema";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AddressApplicationMapper implements IAddressApplicationMapper<AddressType> {
	toResponse(address: AddressEntity): ResponseAddressDto {
		return {
			id: address.id as string,
			userId: address.userId,
			line1: address.line1,
			line2: address.line2,
			city: address.city,
			district: address.district,
			state: address.state,
			country: address.country,
			pincode: address.pincode,
			role: address.role,
			createdAt: address.createdAt,
		};
	}

	toDomain(data: AddressType): AddressEntity {
		return AddressEntity.create({
			id: data._id?.toString(),
			userId: data.userId,
			line1: data.line1,
			line2: data.line2,
			city: data.city,
			district: data.district,
			state: data.state,
			country: data.country,
			pincode: data.pincode,
			role: data.role as "user" | "company",
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
		});
	}
}
