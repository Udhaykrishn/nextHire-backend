import { USER_STATUS } from "../enums/status/user-status.enum";

export class UserEntity {
	private readonly _id?: string;
	private _email: string;
	private _password: string;
	private _name: string;
	private _phone: string;
	private _experience: string = "";
	private _role_of_title: string = "";
	private _status: USER_STATUS = USER_STATUS.PENDING;
	private _resume_url: string = "";
	private _bio: string = "";
	private _badge: boolean = false;
	private _google_id: string = "";
	private _subscription: { current_plan: string; is_subscribed: boolean } = {
		current_plan: "free",
		is_subscribed: false,
	};
	private _social_link: {
		linkedin: string;
		portfolio: string;
		github: string;
	} = {
		linkedin: "",
		portfolio: "",
		github: "",
	};

	private constructor(
		email: string,
		password: string,
		name: string,
		phone: string,
		experience: string,
		role_of_title: string,
		status: USER_STATUS,
		resume_url: string,
		bio: string,
		badge: boolean,
		google_id: string,
		subscription: { current_plan: string; is_subscribed: boolean },
		social_link: { linkedin: string; portfolio: string; github: string },
		id?: string,
	) {
		this._email = email;
		this._password = password;
		this._name = name;
		this._phone = phone;
		this._experience = experience;
		this._role_of_title = role_of_title;
		this._status = status;
		this._resume_url = resume_url;
		this._bio = bio;
		this._badge = badge;
		this._google_id = google_id;
		this._subscription = subscription;
		this._social_link = social_link;
		this._id = id;
	}

	static create(data: {
		email: string;
		password: string;
		name: string;
		phone: string;
		experience?: string;
		role_of_title?: string;
		status?: USER_STATUS;
		resume_url?: string;
		bio?: string;
		badge?: boolean;
		google_id?: string;
		subscription?: { current_plan: string; is_subscribed: boolean };
		social_link?: { linkedin: string; portfolio: string; github: string };
		id?: string;
	}): UserEntity {
		return new UserEntity(
			data.email,
			data.password,
			data.name,
			data.phone,
			data.experience ?? "",
			data.role_of_title ?? "",
			data.status ?? USER_STATUS.PENDING,
			data.resume_url ?? "",
			data.bio ?? "",
			data.badge ?? false,
			data.google_id ?? "",
			data.subscription ?? { current_plan: "free", is_subscribed: false },
			data.social_link ?? { linkedin: "", portfolio: "", github: "" },
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}

	get email(): string {
		return this._email;
	}

	get password(): string {
		return this._password;
	}

	get name(): string {
		return this._name;
	}

	get phone(): string {
		return this._phone;
	}

	get experience(): string {
		return this._experience;
	}

	get role_of_title(): string {
		return this._role_of_title;
	}

	get status(): string {
		return this._status;
	}

	get resume_url(): string {
		return this._resume_url;
	}

	get bio(): string {
		return this._bio;
	}

	get badge(): boolean {
		return this._badge;
	}

	get google_id(): string {
		return this._google_id;
	}

	get subscription(): { current_plan: string; is_subscribed: boolean } {
		return this._subscription;
	}

	get social_link(): { linkedin: string; portfolio: string; github: string } {
		return this._social_link;
	}

	changeName(name: string): void {
		this._name = name;
	}

	changePhone(phone: string): void {
		this._phone = phone;
	}

	changeExperience(experience: string): void {
		this._experience = experience;
	}

	changeRoleOfTitle(role_of_title: string): void {
		this._role_of_title = role_of_title;
	}

	changeStatus(status: USER_STATUS): void {
		this._status = status;
	}

	changeResumeUrl(resume_url: string): void {
		this._resume_url = resume_url;
	}

	changeBio(bio: string): void {
		this._bio = bio;
	}

	changeBadge(badge: boolean): void {
		this._badge = badge;
	}

	changeGoogleId(google_id: string): void {
		this._google_id = google_id;
	}

	changeSubscription(subscription: {
		current_plan: string;
		is_subscribed: boolean;
	}): void {
		this._subscription = subscription;
	}

	changeSocialLink(social_link: {
		linkedin: string;
		portfolio: string;
		github: string;
	}): void {
		this._social_link = social_link;
	}

	changeEmail(newEmail: string): void {
		this._email = newEmail;
	}

	changePassword(newPassword: string): void {
		this._password = newPassword;
	}
}
