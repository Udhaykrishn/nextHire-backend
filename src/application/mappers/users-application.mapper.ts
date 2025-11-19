import { UserEntity } from "@/domain/entity/user.entity";
import type { ResponseUserDto } from "../dto/users/user-response.dto";
import { IUserApplicationMappers } from "../interface/mappers/user-application-mapper.interface";
import { UserType } from "@/infrastructure/db/mongodb/models/user.schema";

export class UserApplicationMapper
	implements IUserApplicationMappers<UserType>
{
	toResponse(user: UserEntity): ResponseUserDto {
		return {
			id: user.id as string,
			email: user.email,
			name: user.name,
			phone: user.phone,
			experience: user.experience,
			role_of_title: user.role_of_title,
			status: user.status,
			resume_url: user.resume_url,
			bio: user.bio,
			badge: user.badge,
			google_id: user.google_id,
			subscription: user.subscription,
			social_link: user.social_link,
		};
	}

	toDomain(data: UserType): UserEntity {
		return UserEntity.create({
			id: data._id?.toString(),
			email: data.email,
			password: data.password,
			name: data.name,
			phone: data.phone,
			experience: data.experience,
			role_of_title: data.role_of_title,
			status: data.status,
			resume_url: data.resume_url,
			bio: data.bio,
			badge: data.badge,
			google_id: data.google_id,
			subscription: data.subscription,
			social_link: data.social_link,
		});
	}
}
