import { CreateUserDto } from "@/application/dto/users/user-create.dto";
import { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import { PaginationResponse } from "@/domain/types/paginations";
import { ChangePasswordDto, UpdateUserDto } from "@/application/dto/users";
import { AuthorizedRequest } from "@/presentation/interface/authorized-request.interface";

export interface IUserController {
	create(userDto: CreateUserDto): Promise<ResponseUserDto>;
	blockAndUnblock(userId: string): Promise<ResponseUserDto>;
	update(userId: string, updateDto: UpdateUserDto): Promise<ResponseUserDto>;
	changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<ResponseUserDto>;
	getAllUsers(search?: string, page?: number, limit?: number): Promise<PaginationResponse<ResponseUserDto>>;
	findUser(req: AuthorizedRequest): Promise<ResponseUserDto>;
	uploadProfileImage(file: Express.Multer.File, req: AuthorizedRequest): Promise<ResponseUserDto>;
	deleteProfileImage(req: AuthorizedRequest): Promise<ResponseUserDto>;
}
