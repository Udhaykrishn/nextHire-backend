import { ADDRESS_TOKEN } from "@/application/enums/tokens/address-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { IAddressRepository } from "@/application/interface/repository/address-repository.interface";
import type { AddressEntity } from "@/domain/entity/address.entity";
import { USER_PROFILE_MESSAGES } from "@/domain/enums";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class DeleteAddressUseCase implements IExecutable<string, void> {
	constructor(
		@Inject(ADDRESS_TOKEN.ADDRESS_REPOSITORY)
		private readonly _addressRepository: IAddressRepository<AddressEntity>,
	) {}

	async execute(id: string): Promise<void> {
		const success = await this._addressRepository.deleteById(id);
		if (!success) {
			throw new NotFoundException(USER_PROFILE_MESSAGES.ADDRESS_NOT_FOUND);
		}
	}
}
