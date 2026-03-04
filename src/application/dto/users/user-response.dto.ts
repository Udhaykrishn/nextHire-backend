export class ResponseUserDto {
	public readonly id: string;
	public readonly email: string;
	public readonly name: string;
	public readonly phone: string;
	public readonly experience: string;
	public readonly role_of_title: string;
	public readonly status: string;
	public readonly resume_url: string;
	public readonly bio: string;
	public readonly badge: boolean;
	public readonly google_id: string;
	public readonly createdAt: Date;
	public readonly skills: string[];
	public readonly languages: {
		name: string;
		proficiency: string;
	}[];
	public readonly subscription: {
		current_plan: string;
		is_subscribed: boolean;
	};
	public readonly social_link: {
		linkedin: string;
		portfolio: string;
		github: string;
	};
	public readonly profile_url: {
		key: string;
		url: string;
	};
}

