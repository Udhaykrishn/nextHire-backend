import type { CreateResponseUserDto } from "@/application/dto/users/user-response.dto";
import type { UserEntity } from "@/domain/entity/user.entity";

export interface IUserApplicationMappers {
	toResponse(user: UserEntity): CreateResponseUserDto;
}
