import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Address, AddressSchema } from "@/infrastructure/db/mongodb/models/address.schema";
import { AddressRepository } from "@/infrastructure/db/mongodb/repository/address.repository";
import { CreateAddressUseCase } from "@/application/use-case/address/create-address.use-case";
import { GetAddressesUseCase } from "@/application/use-case/address/get-addresses.use-case";
import { UpdateAddressUseCase } from "@/application/use-case/address/update-address.use-case";
import { DeleteAddressUseCase } from "@/application/use-case/address/delete-address.use-case";
import { AddressController } from "@/presentation/controller/address/address.controller";
import { ADDRESS_TOKEN } from "@/application/enums/tokens/address-token.enum";
import { ADDRESS_MAPPER } from "@/application/enums";
import { AddressPresistanceMapper } from "@/infrastructure/mappers/address-presistance.mapper";
import { AddressApplicationMapper } from "@/application/mappers/address-application.mapper";

@Module({
	imports: [MongooseModule.forFeature([{ name: Address.name, schema: AddressSchema }])],
	controllers: [AddressController],
	providers: [
		{
			provide: ADDRESS_TOKEN.ADDRESS_REPOSITORY,
			useClass: AddressRepository,
		},
		{
			provide: ADDRESS_MAPPER.ADDRESS_PERSISTANCE,
			useClass: AddressPresistanceMapper,
		},
		{
			provide: ADDRESS_MAPPER.ADDRESS_APPLICATION,
			useClass: AddressApplicationMapper,
		},
		{
			provide: ADDRESS_TOKEN.CREATE_ADDRESS_USE_CASE,
			useClass: CreateAddressUseCase,
		},
		{
			provide: ADDRESS_TOKEN.GET_ADDRESSES_USE_CASE,
			useClass: GetAddressesUseCase,
		},
		{
			provide: ADDRESS_TOKEN.UPDATE_ADDRESS_USE_CASE,
			useClass: UpdateAddressUseCase,
		},
		{
			provide: ADDRESS_TOKEN.DELETE_ADDRESS_USE_CASE,
			useClass: DeleteAddressUseCase,
		},
	],
	exports: [ADDRESS_TOKEN.ADDRESS_REPOSITORY],
})
export class AddressModule {}
