import type { CreateAddressDto } from "@/application/dto/address/create-address.dto";
import type { ResponseAddressDto } from "@/application/dto/address/response-address.dto";
import { ADDRESS_TOKEN } from "@/application/enums/tokens/address-token.enum";
import { ADDRESS_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IAddressRepository } from "@/application/interface/repository/address-repository.interface";
import type { IAddressApplicationMapper } from "@/application/interface/mappers/address/address-application-mapper.interface";
import { AddressEntity } from "@/domain/entity/address.entity";
import { AddressType } from "@/infrastructure/db/mongodb/models/address.schema";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class CreateAddressUseCase implements IExecutable<CreateAddressDto, ResponseAddressDto> {
	constructor(
		@Inject(ADDRESS_TOKEN.ADDRESS_REPOSITORY)
		private readonly _addressRepository: IAddressRepository<AddressEntity>,
		@Inject(ADDRESS_MAPPER.ADDRESS_APPLICATION)
		private readonly _mapper: IAddressApplicationMapper<AddressType>,
	) {}

	async execute(data: CreateAddressDto): Promise<ResponseAddressDto> {
		const address = AddressEntity.create({
			userId: data.userId,
			line1: data.line1,
			line2: data.line2,
			city: data.city,
			district: data.district,
			state: data.state,
			country: data.country,
			pincode: data.pincode,
			role: data.role,
		});

		const savedAddress = await this._addressRepository.save(address);

		return this._mapper.toResponse(savedAddress);
	}
}
