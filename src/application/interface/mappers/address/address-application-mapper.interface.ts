import type { ResponseAddressDto } from "@/application/dto/address/response-address.dto";
import type { AddressEntity } from "@/domain/entity/address.entity";

export interface IAddressApplicationMapper<T> {
	toResponse(data: AddressEntity): ResponseAddressDto;
	toDomain(data: T): AddressEntity;
}
