import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from "@nestjs/common";
import { USER_ROUTERS } from "../enums";
import { USERS_TOKEN } from "@/application/enums/tokens";
import type { IExecutable } from "@/application/interface/executable.interface";
import type { CreateUserDto } from "@/application/dto/users/user-create.dto";
import type { CreateResponseUserDto } from "@/application/dto/users/user-response.dto";

@Controller(USER_ROUTERS.ROUTER)
export class UserController {
	constructor(
		@Inject(USERS_TOKEN.USER_CREATE_USE_CASE)
		private readonly _userCreateUseCase: IExecutable<
			CreateUserDto,
			CreateResponseUserDto
		>,
	) {}

	@Post(USER_ROUTERS.DEFAULT)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() userDto: CreateUserDto): Promise<CreateResponseUserDto> {
		return this._userCreateUseCase.execute(userDto);
	}
}
