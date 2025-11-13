import { Email, Password } from "../value-objects";

export class UserEntity {
	private readonly _id?: string;
	private _email: Email;
	private _password: Password;
	private _name: string;
	private _phone: string;
	private _experience: string = "";
	private _role_of_title: string = "";
	private _status: string = "inactive";
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
		email: Email,
		password: Password,
		name: string,
		phone: string,
		experience: string,
		role_of_title: string,
		status: string,
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

	static async create(data: {
		email: string;
		password: string;
		name: string;
		phone: string;
		experience?: string;
		role_of_title?: string;
		status?: string;
		resume_url?: string;
		bio?: string;
		badge?: boolean;
		google_id?: string;
		subscription?: { current_plan: string; is_subscribed: boolean };
		social_link?: { linkedin: string; portfolio: string; github: string };
		id?: string;
	}): Promise<UserEntity> {
		const email = Email.create(data.email);
		const hashedPassword = await Password.create(data.password);
		return new UserEntity(
			await email,
			hashedPassword,
			data.name,
			data.phone,
			data.experience ?? "",
			data.role_of_title ?? "",
			data.status ?? "inactive",
			data.resume_url ?? "",
			data.bio ?? "",
			data.badge ?? false,
			data.google_id ?? "",
			data.subscription ?? { current_plan: "free", is_subscribed: false },
			data.social_link ?? { linkedin: "", portfolio: "", github: "" },
			data.id,
		);
	}

	// Getters
	get id(): string | undefined {
		return this._id;
	}

	get email(): string {
		return this._email.getValue();
	}

	get password(): string {
		return this._password.getValue();
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

	changeStatus(status: string): void {
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

	async changeEmail(email: string): Promise<void> {
		this._email = await Email.create(email);
	}

	async changePassword(plainPassword: string): Promise<void> {
		this._password = await Password.create(plainPassword);
	}
}
