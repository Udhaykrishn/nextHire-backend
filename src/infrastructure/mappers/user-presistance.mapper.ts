import { UserEntity } from "@/domain/entity/user.entity";
import type { IUserPresitanceMapper } from "@/application/interface/mappers/user-presistance.mapper";
import type { UserType } from "../db/mongodb/models/user.schema";
import type { USER_STATUS } from "@/domain/enums/status/user-status.enum";

export class UserPresitanceMapper
	implements IUserPresitanceMapper<UserEntity, UserType>
{
	toMongo(user: UserEntity) {
		return {
			_id: user.id as string,
			email: user.email,
			name: user.name,
			password: user.password,
			phone: user.phone,
			experience: user.experience,
			role_of_title: user.role_of_title,
			status: user.status as USER_STATUS,
			resume_url: user.resume_url,
			bio: user.bio,
			badge: user.badge,
			google_id: user.google_id,
			subscription: user.subscription,
			social_link: user.social_link,
			createdAt: user.createdAt,
		};
	}

	async fromMongo(doc: UserType): Promise<UserEntity> {
		return UserEntity.create({
			id: doc._id.toString(),
			email: doc.email,
			password: doc.password,
			name: doc.name,
			phone: doc.phone,
			experience: doc.experience,
			role_of_title: doc.role_of_title,
			status: doc.status,
			resume_url: doc.resume_url,
			bio: doc.bio,
			badge: doc.badge,
			google_id: doc.google_id,
			subscription: doc.subscription,
			social_link: doc.social_link,
			createdAt: doc.createdAt,
		});
	}
}
