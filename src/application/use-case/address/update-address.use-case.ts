import type { UpdateAddressDto } from "@/application/dto/address/update-address.dto";
import type { ResponseAddressDto } from "@/application/dto/address/response-address.dto";
import { ADDRESS_TOKEN } from "@/application/enums/tokens/address-token.enum";
import { ADDRESS_MAPPER } from "@/application/enums";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IAddressRepository } from "@/application/interface/repository/address-repository.interface";
import type { IAddressApplicationMapper } from "@/application/interface/mappers/address/address-application-mapper.interface";
import type { AddressEntity } from "@/domain/entity/address.entity";
import type { AddressType } from "@/infrastructure/db/mongodb/models/address.schema";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class UpdateAddressUseCase implements IExecutable<UpdateAddressDto, ResponseAddressDto> {
	constructor(
		@Inject(ADDRESS_TOKEN.ADDRESS_REPOSITORY)
		private readonly _addressRepository: IAddressRepository<AddressEntity>,
		@Inject(ADDRESS_MAPPER.ADDRESS_APPLICATION)
		private readonly _mapper: IAddressApplicationMapper<AddressType>,
	) {}

	async execute(data: UpdateAddressDto): Promise<ResponseAddressDto> {
		const address = await this._addressRepository.findById(data.id);
		if (!address) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.ADDRESS_NOT_FOUND);
		}

		if (data.line1) address.changeLine1(data.line1);
		if (data.line2) address.changeLine2(data.line2);
		if (data.city) address.changeCity(data.city);
		if (data.district) address.changeDistrict(data.district);
		if (data.state) address.changeState(data.state);
		if (data.country) address.changeCountry(data.country);
		if (data.pincode) address.changePincode(data.pincode);

		const updatedAddress = await this._addressRepository.findByIdAndUpdate(address.id!, address);

		if (!updatedAddress) {
			throw new BadRequestException("Address not found");
		}

		return this._mapper.toResponse(updatedAddress);
	}
}
