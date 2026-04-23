export class ResponseRecruiterDto {
	public readonly id: string;
	public readonly email: string;
	public readonly name: string;
	public readonly phone: string;

	public readonly GSTIN: string | null;
	public readonly CIN: string | null;
	public readonly status: string;
	public readonly website_link: string | null;
	public readonly description: string | null;
	public readonly category: string | null;
	public readonly company_role: string;
	public readonly is_verified_company: boolean;
	public readonly admin_approved: boolean;

	public readonly subscription: {
		current_plan: string;
		is_subscribed: boolean;
	};

	public readonly profile_url: {
		key: string;
		url: string;
	};

	public readonly createdAt: Date;
	public readonly updatedAt: Date | null;
}
