import type { ResponseAddressDto } from "@/application/dto/address/response-address.dto";
import { ADDRESS_TOKEN } from "@/application/enums/tokens/address-token.enum";
import { ADDRESS_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IAddressRepository } from "@/application/interface/repository/address-repository.interface";
import type { IAddressApplicationMapper } from "@/application/interface/mappers/address/address-application-mapper.interface";
import type { AddressEntity } from "@/domain/entity/address.entity";
import type { AddressType } from "@/infrastructure/db/mongodb/models/address.schema";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAddressesUseCase implements IExecutable<string, ResponseAddressDto[]> {
	constructor(
		@Inject(ADDRESS_TOKEN.ADDRESS_REPOSITORY)
		private readonly _addressRepository: IAddressRepository<AddressEntity>,
		@Inject(ADDRESS_MAPPER.ADDRESS_APPLICATION)
		private readonly _mapper: IAddressApplicationMapper<AddressType>,
	) {}

	async execute(userId: string): Promise<ResponseAddressDto[]> {
		const addresses = await this._addressRepository.findByUserId(userId);
		if (!addresses || addresses.length === 0) return [];
		return addresses.map((addr) => this._mapper.toResponse(addr));
	}
}
