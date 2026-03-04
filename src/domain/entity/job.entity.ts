export class JobEntity {
	private readonly _id?: string;
	private _job_title: string;
	private _job_description: string;
	private _job_logo: string;
	private _work_mode: string;
	private _job_requirements: { requirement: string; title: string }[];
	private _job_shift: string;
	private _walk_in_interview: {
		additions: string;
		document_carry: string[];
		interview_date: string;
		interview_location: string;
		interview_mode: string;
		is_active: boolean;
	};
	private _company_id: string;
	private _salary: { max: string; min: string };
	private _job_role_department: string[];
	private _requirement_ats: { fields: string; title: string }[];
	private _posted_by: string;
	private _job_highlights: string;
	private _created_at: string;
	private _updated_at: string;
	private _status: string;
	private _is_published: boolean;
	private _job_type: string;

	private constructor(
		job_title: string,
		job_description: string,
		job_logo: string,
		work_mode: string,
		job_requirements: { requirement: string; title: string }[],
		job_shift: string,
		walk_in_interview: {
			additions: string;
			document_carry: string[];
			interview_date: string;
			interview_location: string;
			interview_mode: string;
			is_active: boolean;
		},
		company_id: string,
		salary: { max: string; min: string },
		job_role_department: string[],
		requirement_ats: { fields: string; title: string }[],
		posted_by: string,
		job_highlights: string,
		created_at: string,
		updated_at: string,
		status: string,
		is_published: boolean,
		job_type: string,
		id?: string,
	) {
		this._id = id;
		this._job_title = job_title;
		this._job_description = job_description;
		this._job_logo = job_logo;
		this._work_mode = work_mode;
		this._job_requirements = job_requirements;
		this._job_shift = job_shift;
		this._walk_in_interview = walk_in_interview;
		this._company_id = company_id;
		this._salary = salary;
		this._job_role_department = job_role_department;
		this._requirement_ats = requirement_ats;
		this._posted_by = posted_by;
		this._job_highlights = job_highlights;
		this._created_at = created_at;
		this._updated_at = updated_at;
		this._status = status;
		this._is_published = is_published;
		this._job_type = job_type;
	}

	static create(data: {
		job_title: string;
		job_description: string;
		job_logo?: string;
		work_mode?: string;
		job_requirements?: { requirement: string; title: string }[];
		job_shift?: string;
		walk_in_interview?: {
			additions: string;
			document_carry: string[];
			interview_date: string;
			interview_location: string;
			interview_mode: string;
			is_active: boolean;
		};
		company_id: string;
		salary?: { max: string; min: string };
		job_role_department?: string[];
		requirement_ats?: { fields: string; title: string }[];
		posted_by: string;
		job_highlights?: string;
		status?: string;
		is_published?: boolean;
		job_type?: string;
		id?: string;
		created_at?: string;
		updated_at?: string;
	}): JobEntity {
		return new JobEntity(
			data.job_title,
			data.job_description,
			data.job_logo || "",
			data.work_mode || "",
			data.job_requirements || [],
			data.job_shift || "",
			data.walk_in_interview || {
				additions: "",
				document_carry: [],
				interview_date: "",
				interview_location: "",
				interview_mode: "",
				is_active: false,
			},
			data.company_id,
			data.salary || { max: "", min: "" },
			data.job_role_department || [],
			data.requirement_ats || [],
			data.posted_by,
			data.job_highlights || "",
			data.created_at || new Date().toISOString(),
			data.updated_at || new Date().toISOString(),
			data.status || "OPEN",
			data.is_published || false,
			data.job_type || "FULL_TIME",
			data.id,
		);
	}

	get id(): string | undefined {
		return this._id;
	}
	get job_title(): string {
		return this._job_title;
	}
	get job_description(): string {
		return this._job_description;
	}
	get job_logo(): string {
		return this._job_logo;
	}
	get work_mode(): string {
		return this._work_mode;
	}
	get job_requirements(): { requirement: string; title: string }[] {
		return this._job_requirements;
	}
	get job_shift(): string {
		return this._job_shift;
	}
	get walk_in_interview(): {
		additions: string;
		document_carry: string[];
		interview_date: string;
		interview_location: string;
		interview_mode: string;
		is_active: boolean;
	} {
		return this._walk_in_interview;
	}
	get company_id(): string {
		return this._company_id;
	}
	get salary(): { max: string; min: string } {
		return this._salary;
	}
	get job_role_department(): string[] {
		return this._job_role_department;
	}
	get requirement_ats(): { fields: string; title: string }[] {
		return this._requirement_ats;
	}
	get posted_by(): string {
		return this._posted_by;
	}
	get job_highlights(): string {
		return this._job_highlights;
	}
	get created_at(): string {
		return this._created_at;
	}
	get updated_at(): string {
		return this._updated_at;
	}
	get status(): string {
		return this._status;
	}
	get is_published(): boolean {
		return this._is_published;
	}
	get job_type(): string {
		return this._job_type;
	}
}
