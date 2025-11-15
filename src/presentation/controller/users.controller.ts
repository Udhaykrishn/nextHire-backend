import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from "@nestjs/common";
import { USER_ROUTERS } from "../enums";
import { USERS_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { CreateUserDto } from "@/application/dto/users/user-create.dto";
import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import type { PaginationDto } from "@/application/dto/pagiation";
import {
	type PaginationResponse,
	PaginationInputType,
} from "@/domain/types/paginations";
import type { UpdateUserDto } from "@/application/dto/users";

@Controller(USER_ROUTERS.ROUTER)
export class UserController {
	constructor(
		@Inject(USERS_TOKEN.USER_CREATE_USE_CASE)
		private readonly _userCreateUseCase: IExecutable<
			CreateUserDto,
			ResponseUserDto
		>,
		@Inject(USERS_TOKEN.USER_GET_ALL_USE_CASE)
		private readonly _getAllUsersUseCase: IExecutable<
			PaginationDto,
			PaginationResponse<ResponseUserDto>
		>,
		@Inject(USERS_TOKEN.USER_UPDATE_USE_CASE)
		private readonly _updateUserUseCase: IExecutable<
			{ userId: string; data: UpdateUserDto },
			ResponseUserDto
		>,
		@Inject(USERS_TOKEN.USER_BLOCK_UNBLOCK_USE_CASE)
		private readonly _blockUnblockUseCase: IExecutable<string, ResponseUserDto>,
	) {}

	@Post(USER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() userDto: CreateUserDto): Promise<ResponseUserDto> {
		return this._userCreateUseCase.execute(userDto);
	}

	@Patch(USER_ROUTERS.BLOCK)
	@HttpCode(HttpStatus.OK)
	async blockAndUnblock(
		@Param(USER_ROUTERS.ID_PARAM) userId: string,
	): Promise<ResponseUserDto> {
		return this._blockUnblockUseCase.execute(userId);
	}

	@Patch(`:${USER_ROUTERS.ID_PARAM}`)
	@HttpCode(HttpStatus.OK)
	async update(
		@Param(USER_ROUTERS.ID_PARAM) userId: string,
		@Body() updateDto: UpdateUserDto,
	): Promise<ResponseUserDto> {
		return this._updateUserUseCase.execute({ data: updateDto, userId });
	}

	@Get(USER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.OK)
	async getAllUsers(
		@Query(PaginationInputType.SEARCH) search?: string,
		@Query(PaginationInputType.PAGE, ParseIntPipe) page: number = 1,
		@Query(PaginationInputType.LIMIT, ParseIntPipe) limit: number = 10,
	): Promise<PaginationResponse<ResponseUserDto>> {
		const paginationDto: PaginationDto = {
			search,
			page,
			limit,
		};
		return this._getAllUsersUseCase.execute(paginationDto);
	}
}
