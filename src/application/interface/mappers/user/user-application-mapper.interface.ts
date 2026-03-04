import type { ResponseUserDto } from "@/application/dto/users/user-response.dto";
import type { UserEntity } from "@/domain/entity/user.entity";

export interface IUserApplicationMappers<T> {
	toResponse(user: UserEntity): ResponseUserDto;
	toDomain(data: T): UserEntity;
}
