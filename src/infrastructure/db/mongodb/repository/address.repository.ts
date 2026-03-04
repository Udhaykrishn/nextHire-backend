import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepository } from "./base.repository";
import type { AddressEntity } from "@/domain/entity/address.entity";
import type { IAddressRepository } from "@/application/interface/repository";
import { Address } from "../models";
import type { Model } from "mongoose";
import { ADDRESS_MAPPER } from "@/application/enums";
import type { IAddressPresistanceMapper } from "@/application/interface/mappers/address/address-presistance.mapper";
import type { AddressType } from "../models/address.schema";

@Injectable()
export class AddressRepository
	extends BaseRepository<AddressEntity, AddressType>
	implements IAddressRepository<AddressEntity>
{
	constructor(
		@InjectModel(Address.name) private addressModel: Model<AddressType>,
		@Inject(ADDRESS_MAPPER.ADDRESS_PERSISTANCE)
		mapper: IAddressPresistanceMapper<AddressEntity, AddressType>,
	) {
		super(addressModel, mapper);
	}

	async findByUserId(userId: string): Promise<AddressEntity[]> {
		const docs = await this.addressModel.find({ userId });
		return Promise.all(docs.map((doc) => this.mapper.fromMongo(doc)));
	}
}
