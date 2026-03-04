import { CreateAddressDto } from "@/application/dto/address/create-address.dto";
import { UpdateAddressDto } from "@/application/dto/address/update-address.dto";
import { ResponseAddressDto } from "@/application/dto/address/response-address.dto";
import { ADDRESS_TOKEN } from "@/application/enums/tokens/address-token.enum";
import type { IExecutable } from "@/application/interface/executable.interface";
import { AuthGuard } from "@/presentation/guards/auth.guard";
import { RoleGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/role.decorator";
import { USER_ROLE } from "@/domain/enums";
import { ADDRESS_ROUTER } from "@/presentation/enums";
import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import type {Request} from "express"


@Controller(ADDRESS_ROUTER.ROUTER)
@UseGuards(AuthGuard, RoleGuard)
@Roles(USER_ROLE.USER)
export class AddressController {
	constructor(
		@Inject(ADDRESS_TOKEN.CREATE_ADDRESS_USE_CASE)
		private readonly _createAddressUseCase: IExecutable<CreateAddressDto, ResponseAddressDto>,
		@Inject(ADDRESS_TOKEN.GET_ADDRESSES_USE_CASE)
		private readonly _getAddressesUseCase: IExecutable<string, ResponseAddressDto[]>,
		@Inject(ADDRESS_TOKEN.UPDATE_ADDRESS_USE_CASE)
		private readonly _updateAddressUseCase: IExecutable<UpdateAddressDto, ResponseAddressDto>,
		@Inject(ADDRESS_TOKEN.DELETE_ADDRESS_USE_CASE)
		private readonly _deleteAddressUseCase: IExecutable<string, void>,
	) {}

	@Post(ADDRESS_ROUTER.DEFAULT)
	async create(@Req() req: Request, @Body() dto: CreateAddressDto) {
		dto.userId = req.user.id;
		dto.role = "user";
		return await this._createAddressUseCase.execute(dto);
	}

	@Get(ADDRESS_ROUTER.DEFAULT)
	async getAll(@Req() req: Request) {
		return await this._getAddressesUseCase.execute(req.user.id);
	}

	@Put(ADDRESS_ROUTER.ID)
	async update(@Param(ADDRESS_ROUTER.ID_PARAM) id: string, @Body() dto: UpdateAddressDto) {
		dto.id = id;
		return await this._updateAddressUseCase.execute(dto);
	}

	@Delete(ADDRESS_ROUTER.ID)
	async delete(@Param(ADDRESS_ROUTER.ID_PARAM) id: string) {
		return await this._deleteAddressUseCase.execute(id);
	}
}
