import type { UserEntity } from "@/domain/entity/user.entity";
import type { CreateResponseUserDto } from "../dto/users/user-response.dto";

export class UserApplicationMapper {
	toResponse(user: UserEntity): CreateResponseUserDto {
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
}
